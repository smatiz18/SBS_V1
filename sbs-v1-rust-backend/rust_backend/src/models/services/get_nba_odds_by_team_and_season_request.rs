use serde::Deserialize;


#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GetNbaOddsByTeamAndSeasonRequest {
    pub team_name: String,
    pub season: u32,
}