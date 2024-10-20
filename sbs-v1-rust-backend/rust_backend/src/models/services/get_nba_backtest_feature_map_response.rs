use serde::Serialize;

use crate::models::{nba_backtest_player_feature_map::NbaBacktestPlayerFeatureMap, nba_backtest_team_feature_map::NbaBacktestTeamFeatureMap};

#[derive(Serialize, Debug)]
pub struct NbaBacktestFeatureMapResponse {
    pub error: Option<String>,
    pub team_feature_map: Option<Vec<NbaBacktestTeamFeatureMap>>,
    pub player_feature_map: Option<Vec<NbaBacktestPlayerFeatureMap>>
}