use bson::{doc, from_document, to_document, Document};
use chrono::{SecondsFormat, Utc};
use mongodb::options::FindOptions;
use mongodb::Collection;
use crate::db::base_mongo::find as base_find;
use crate::models::db::user_info::UserInfo;
use crate::models::services::login_result::LoginResult;
use mongodb::error::Result;

pub async fn handle_user_login(
    collection: &Collection<Document>,
    user_info: UserInfo
) -> Result<LoginResult> {

    let match_query = doc! {
        "email": user_info.email.clone()
    };

    let users = find(collection, match_query.clone(), None).await?;
    if users.is_empty() {
        let new_user_info = UserInfo {
            _id: user_info.email.clone(),
            email: user_info.email,
            username: user_info.username,
            firstname: user_info.firstname,
            lastname: user_info.lastname,
            is_premium_user: user_info.is_premium_user,
            member_since: Some(Utc::now()),
            last_login: Some(Utc::now()),
            number_of_logins: Some(1),
            login_source: user_info.login_source
        };
        let _ = collection.insert_one(to_document(&new_user_info).unwrap(), None).await?;
    } else if users[0].login_source.to_string() != user_info.login_source.to_string() {
        return Ok(
            LoginResult {
                is_error: true,
                error_message: Some(
                    format!(
                        "Account already exists with {:?}", 
                        users[0].login_source.to_string()
                    )
                ),
                user_info: None
            }
        );
    } else {
        let _ = collection.update_one(
            match_query.clone(), 
            doc! {
                "$set": doc! {
                    "lastLogin": Utc::now().to_rfc3339_opts(SecondsFormat::AutoSi, true),
                    "numberOfLogins": users[0].number_of_logins.unwrap_or(0) + 1
                }
            }, 
            None
        ).await;
    }

    let updated_user_info_mongo_res = find(collection, match_query, None).await;

    let updated_user_info = updated_user_info_mongo_res.unwrap_or(vec!());

    if updated_user_info.get(0).is_none() {
        return Ok(
            LoginResult {
                is_error: true,
                error_message: Some("unable to update user metadata".to_string()),
                user_info: None
            }
        );
    }
    return Ok(
        LoginResult {
            is_error: false,
            error_message: None,
            user_info: updated_user_info.get(0).cloned()
        }
    );
 }

pub async fn find(
    collection: &Collection<Document>,
    match_query: Document,
    options: Option<FindOptions>
) -> Result<Vec<UserInfo>> {
    let results = base_find(&collection, match_query, options).await?;
    Ok(parse_doc_to_obj(results))
}

fn parse_doc_to_obj(
    docs: Vec<Document>
) -> Vec<UserInfo> {
    docs.iter()
        .flat_map(|doc| 
            match from_document::<UserInfo>(doc.clone()) {
                Ok(obj) => Some(obj),
                Err(e) => {
                println!("Failed to convert doc to obj: {}", e);
                None
                }
            }
        )
        .collect()
}