use std::fmt;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use strum_macros::EnumString;

#[derive(PartialEq, Serialize, Deserialize, Debug, Clone, EnumString)]
pub enum LoginSource {
    #[strum(serialize = "Gmail")]
    Gmail,

    #[strum(serialize = "GitHub")]
    GitHub
}

impl fmt::Display for LoginSource {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            LoginSource::Gmail => write!(f, "Gmail"),
            LoginSource::GitHub => write!(f, "GitHub"),
        }
    }
}

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
    pub number_of_logins: Option<u32>,
    pub login_source: LoginSource
}