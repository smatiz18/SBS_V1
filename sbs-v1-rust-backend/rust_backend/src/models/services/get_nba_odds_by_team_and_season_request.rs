use serde::Deserialize;


#[derive(Debug, Deserialize, Clone)]
pub struct GetNbaOddsByTeamAndSeasonRequest {
    #[serde(rename = "teamName")]
    pub team_name: String,

    pub season: f64,
}