use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct GetNbaPlayersByTeamAndSeason {
    pub teamId: f32,
    pub season: f32,
}