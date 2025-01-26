use awc::error::HeaderValue;
use reqwest::header::{HeaderMap, AUTHORIZATION, USER_AGENT};
use serde_json::{json, Value};

use crate::models::web_api::web_api_res::WebApiRes;

pub async fn get_google_user_info(access_token: String) -> WebApiRes {
    let url = "https://www.googleapis.com/oauth2/v2/userinfo";
    let mut headers = HeaderMap::new();
    let header_val = format!("Bearer {}", access_token);
    
    headers.insert(
        AUTHORIZATION, 
        HeaderValue::from_str(&header_val).expect("access_token")
    );
    
    get(url, headers).await
}

pub async fn get_github_user_info(access_token: String) -> WebApiRes {
    let url = "https://api.github.com/user";
    let mut headers = HeaderMap::new();
    let header_val = format!("Bearer {}", access_token);
    
    headers.insert(
        AUTHORIZATION, 
        HeaderValue::from_str(&header_val).expect("access_token")
    );
    headers.insert(
        USER_AGENT,
            HeaderValue::from_static("reqwest")
    );
    
    get(url, headers).await
}

pub async fn get_github_user_email_info(access_token: String) -> WebApiRes {
    let url = "https://api.github.com/user/emails";
    let mut headers: HeaderMap = HeaderMap::new();
    let header_val = format!("Bearer {}", access_token);

    headers.insert(
        AUTHORIZATION, 
        HeaderValue::from_str(&header_val).expect("access_token")
    );
    headers.insert(
        USER_AGENT,
            HeaderValue::from_static("reqwest")
    );

    get(url, headers).await
}

async fn get(url: &str, headers: HeaderMap) -> WebApiRes {
    let client: reqwest::Client = reqwest::Client::new();
 
    match client.get(url.to_owned())
        .headers(headers)
        .send()
        .await {
            Ok(r) => {
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