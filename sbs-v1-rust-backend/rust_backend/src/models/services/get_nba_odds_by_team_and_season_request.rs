use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct GetNbaOddsByTeamAndSeasonRequest {
    pub teamName: String,
    pub season: f64,
}