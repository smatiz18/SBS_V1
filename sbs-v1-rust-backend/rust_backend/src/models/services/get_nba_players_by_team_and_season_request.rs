use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct GetNbaPlayersByTeamAndSeasonRequest {
    #[serde(rename = "teamId")]
    pub team_id: i32,
    pub season: i32
}