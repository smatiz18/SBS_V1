use serde::{Deserialize, Serialize};

use crate::models::enums::season_type::SeasonType;

#[derive(Deserialize, Serialize, Clone, Debug)]
#[serde(rename_all="camelCase")]
pub struct GetNbaTeamStatsRequest {
    pub team_ids: Vec<f64>,
    pub season: Option<u32>,
    pub season_type: Option<SeasonType>
}