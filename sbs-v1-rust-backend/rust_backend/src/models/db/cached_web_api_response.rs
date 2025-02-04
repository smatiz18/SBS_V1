use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use crate::models::web_api::web_api_res::WebApiRes;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CachedWebApiResponse {
    pub _id: String,
    pub cached_date_time: DateTime<Utc>,
    pub response: WebApiRes,
    pub wait_refresh: i64 // in milli
}