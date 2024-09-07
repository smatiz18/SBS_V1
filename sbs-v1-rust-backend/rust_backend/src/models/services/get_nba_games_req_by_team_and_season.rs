use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct GetNbaGamesByTeamAndSeasonRequest {
    pub teamNickname: String,
    pub season: f32,
}