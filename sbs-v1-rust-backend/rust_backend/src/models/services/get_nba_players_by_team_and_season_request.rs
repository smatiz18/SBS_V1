use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct GetNbaPlayersByTeamAndSeasonRequest {
    #[serde(rename = "teamId")]
    pub team_id: f64,
    pub season: u32
}