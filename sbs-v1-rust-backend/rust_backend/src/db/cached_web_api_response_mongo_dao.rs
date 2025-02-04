use bson::{doc, from_document, to_document, Document};
use log::error;
use mongodb::{options::{FindOneAndReplaceOptions, FindOptions}, Collection};

use super::{base_mongo::find as base_find, cached_web_api_response::CachedWebApiResponse};
use mongodb::error::Result;

pub async fn get_response(
    collection: &Collection<Document>, 
    id: String
) -> Vec<CachedWebApiResponse> {
    let match_query = doc! {
        "_id": id
    };

    match find(collection, match_query.clone(), None).await {
        Ok(objs) => {
            objs
        },
        Err(e) => {
            error!(
                "error finding cached web api responses for id: {:?}, error: {:?}", 
                match_query.to_string(), 
                e.to_string()
            );
            vec!()
        }
    }
}

pub async fn cache_response(
    collection: &Collection<Document>,
    response: CachedWebApiResponse
) -> Option<CachedWebApiResponse> {
    let replace_options = FindOneAndReplaceOptions::builder()
        .upsert(true)
        .build();

    let match_query = doc! {
        "_id": response.clone()._id
    };
    
    match collection.find_one_and_replace(
        match_query, 
        to_document(&response).unwrap(), 
        replace_options
    ).await {
        Ok(updated_doc_opt) => 
            updated_doc_opt.and_then(|doc| {
                parse_doc_to_obj(vec![doc]).into_iter().next()
            }),
        Err(e) => {
            error!("unable to find and replace doc with id: {:?}", e);
            None
        }
    }
}

pub async fn find(
    collection: &Collection<Document>,
    match_query: Document,
    options: Option<FindOptions>
) -> Result<Vec<CachedWebApiResponse>> {
    let results = base_find(&collection, match_query, options).await?;
    Ok(parse_doc_to_obj(results))
}

fn parse_doc_to_obj(
    docs: Vec<Document>
) -> Vec<CachedWebApiResponse> {
    docs.iter()
        .flat_map(|doc| 
            match from_document::<CachedWebApiResponse>(doc.clone()) {
                Ok(obj) => Some(obj),
                Err(e) => {
                println!("Failed to convert doc to obj: {}", e);
                None
                }
            }
        )
        .collect()
}