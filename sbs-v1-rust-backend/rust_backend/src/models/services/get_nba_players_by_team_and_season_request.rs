use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct GetNbaPlayersByTeamAndSeasonRequest {
    #[serde(rename = "teamId")]
    pub team_id: i32,
    pub season: i32
}