use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize, Clone)]
pub struct WebApiRes {
    pub is_error: Option<bool>,
    pub error_message: Option<String>,
    pub data: Option<Value>
}
