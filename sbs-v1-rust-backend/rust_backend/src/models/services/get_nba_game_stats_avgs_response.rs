use std::collections::HashMap;
use serde::Serialize;

use crate::models::db::nba_game_stats_avgs_historical::NbaGameStatsAvgsHistorical;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GetNbaGameStatsAvgResponse {
    pub game_stats_avgs: HashMap<String, NbaGameStatsAvgsHistorical>
}