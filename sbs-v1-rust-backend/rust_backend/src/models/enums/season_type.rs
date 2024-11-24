use std::fmt;

use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum SeasonType {
    REGULAR,
    PLAYOFF,
    ALL,
}
impl fmt::Display for SeasonType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            SeasonType::REGULAR => write!(f, "REGULAR"),
            SeasonType::PLAYOFF => write!(f, "PLAYOFF"),
            SeasonType::ALL => write!(f, "ALL")
        }
    }
}