use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct GetNbaOddsReqByTeamAndSeason {
    pub teamName: String,
    pub season: f32,
}