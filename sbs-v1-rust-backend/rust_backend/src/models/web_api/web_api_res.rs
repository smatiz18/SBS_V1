use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WebApiRes {
    pub is_error: bool,
    pub error_message: Option<String>,
    pub data: Option<Value>,
    pub cached_date_time: Option<DateTime<Utc>>
}
