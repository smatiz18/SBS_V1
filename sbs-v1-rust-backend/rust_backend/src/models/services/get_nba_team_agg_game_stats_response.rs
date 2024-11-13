use std::collections::HashMap;
use serde::Serialize;

use crate::models::db::nba_team_agg_game_stats_historical::NbaTeamAggGameStatsHistorical;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GetNbaTeamAggGameStatsResponse {
    pub game_stats_avgs: HashMap<String, NbaTeamAggGameStatsHistorical>
}