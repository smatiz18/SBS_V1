use awc::error::HeaderValue;
use log::info;
use reqwest::header::{HeaderMap, AUTHORIZATION};
use serde_json::{json, Value};

use crate::models::web_api::web_api_res::WebApiRes;

pub async fn get_github_user_info(access_token: String) -> WebApiRes {
    let url = "https://api.github.com/user";
    let mut headers = HeaderMap::new();
    let header_val = format!("Bearer {}", access_token.trim_matches('"'));
    
    headers.insert(
        "Authorization", 
        HeaderValue::from_str(header_val.as_str()).unwrap()
    );
    info!("HEADERS: {:?}", headers);
    
    get(url, Some(headers)).await
}

pub async fn get_github_user_email_info(access_token: String) -> WebApiRes {
    let url = "https://api.github.com/user/emails";
    let mut headers: HeaderMap = HeaderMap::new();
    let header_val = format!("Bearer {}", access_token.trim_matches('"'));
    
    headers.insert(
        AUTHORIZATION, 
        HeaderValue::from_str(header_val.as_str()).unwrap()
    );

    get(url, Some(headers)).await
}

async fn get(url: &str, headers: Option<HeaderMap>) -> WebApiRes {
    let client: reqwest::Client = reqwest::Client::new();
    let mut builder = client.get(url.to_owned());
    
    if headers.is_some() {
        builder = builder.headers(headers.unwrap())
    }
    
    match builder
        .send()
        .await {
            Ok(r) => {
                info!("{:?}", r);
                WebApiRes {
                    is_error: Some(false),
                    error_message: None,
                    data: Some(r.json::<Value>().await.unwrap_or(json!({ "err": "err" })))
                }
            },
            Err(e) => 
                WebApiRes {
                    is_error: Some(true),
                    error_message: Some(e.to_string()),
                    data: None
                }, 
        }
}