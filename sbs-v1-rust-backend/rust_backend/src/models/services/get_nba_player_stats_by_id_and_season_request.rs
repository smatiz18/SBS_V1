use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct GetNbaPlayerStatsByIdAndSeasonRequest {
    pub playerId: f64,
    pub season: String
}