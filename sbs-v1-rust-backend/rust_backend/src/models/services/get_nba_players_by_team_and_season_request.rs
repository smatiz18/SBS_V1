use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GetNbaPlayersByTeamAndSeasonRequest {
    pub team_id: f64,
    pub season: u32
}