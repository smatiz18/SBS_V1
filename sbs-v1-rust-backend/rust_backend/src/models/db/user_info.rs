use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct UserInfo {
    pub _id: String,
    pub email: String,
    pub username: Option<String>,
    pub firstname: Option<String>,
    pub lastname: Option<String>,
    pub is_premium_user: Option<bool>,
    pub member_since: Option<DateTime<Utc>>,
    pub last_login: Option<DateTime<Utc>>,
    pub number_of_logins: Option<u32>
}