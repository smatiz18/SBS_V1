use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct GetNbaGamesByTeamAndSeasonRequest {
    pub teamId: f64,
    pub season: f64,
}