use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct GetNbaPlayerStatsByIdAndSeasonRequest {
    #[serde(rename = "playerId")]
    pub player_id: f64,
    pub season: String
}