use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::models::web_api::web_api_res::WebApiRes;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CachedWebApiResponse {
    pub _id: String,
    pub url: String,
    pub request: Option<Value>,
    pub cached_date_time: DateTime<Utc>,
    pub response: WebApiRes,
    pub wait_refresh: u32 // in milli
}