use serde::Deserialize;


#[derive(Debug, Deserialize)]
pub struct GetNbaOddsByTeamAndSeasonRequest {
    #[serde(rename = "teamName")]
    pub team_name: String,

    pub season: f64,
}