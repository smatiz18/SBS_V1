use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct GetNbaGamesByTeamAndSeasonRequest {
    #[serde(rename = "teamId")]
    pub team_id: f64,

    pub season: f64,
}