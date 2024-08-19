use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct GetNbaGameReqByTeamAndSeason {
    pub teamNickname: String,
    pub season: f32,
}