use serde::Deserialize;

use crate::models::enums::season_type::SeasonType;

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GetNbaGameStatsAvgRequest {
    pub team_ids: Vec<f64>,
    pub season: u32,
    pub season_type: Option<SeasonType>
}