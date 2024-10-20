use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct GetNbaPlayerStatsByIdAndSeasonRequest {
    #[serde(rename = "playerId")]
    pub player_id: f64,
    pub season: String
}