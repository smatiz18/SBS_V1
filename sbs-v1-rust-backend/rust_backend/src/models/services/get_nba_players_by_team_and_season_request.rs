use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct GetNbaPlayersByTeamAndSeasonRequest {
    pub teamId: i32,
    pub season: i32
}