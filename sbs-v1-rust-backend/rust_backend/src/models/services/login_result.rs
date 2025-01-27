use serde::{Deserialize, Serialize};

use crate::models::db::user_info::UserInfo;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct LoginResult {
    pub is_error: bool,
    pub error_message: Option<String>,
    pub user_info: Option<UserInfo>
}