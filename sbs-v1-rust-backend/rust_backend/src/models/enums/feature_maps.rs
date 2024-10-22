
use serde::{Deserialize, Serialize};

use crate::models::{nba_backtest_player_features::NbaBacktestPlayerFeatures, nba_backtest_team_features::NbaBacktestTeamFeatures};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum FeatureMaps {
    NbaBacktestTeamFeatureMap(Vec<NbaBacktestTeamFeatures>),
    NbaBacktestPlayerFeatureMap(Vec<NbaBacktestPlayerFeatures>)
}