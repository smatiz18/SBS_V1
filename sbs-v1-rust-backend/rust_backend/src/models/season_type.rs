use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub enum SeasonType {
    REGULAR,
    PLAYOFF,
    ALL,
}