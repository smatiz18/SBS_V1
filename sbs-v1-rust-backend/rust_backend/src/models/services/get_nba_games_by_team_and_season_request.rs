use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct GetNbaGamesByTeamAndSeasonRequest {
    #[serde(rename = "teamId")]
    pub team_id: f64,

    pub season: u32,
}