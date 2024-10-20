use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum SeasonType {
    REGULAR,
    PLAYOFF,
    ALL,
}