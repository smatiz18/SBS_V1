use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GetNbaPlayerStatsByIdAndSeasonRequest {
    pub player_id: f64,
    pub season: String
}