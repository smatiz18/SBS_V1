use serde::{Serialize, Deserialize};
use crate::models::enums::season_type::SeasonType;

#[derive(Deserialize, Serialize, Clone, Debug)]
#[serde(rename_all="camelCase")]
pub struct GetNbaPlayerStatsByNameAndSeasonRequest {
    pub names: Vec<Name>,
    pub season: i32,
    pub season_type: Option<SeasonType>
}

#[derive(Deserialize, Serialize, Clone, Debug)]
#[serde(rename_all="camelCase")]
pub struct Name {
    pub firstname: String,
    pub lastname: String
}