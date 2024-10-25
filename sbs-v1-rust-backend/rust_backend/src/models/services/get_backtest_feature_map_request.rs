use serde::{Deserialize, Serialize};

use crate::models::enums::{player_bet_types::PlayerBetTypes, season_type::SeasonType, sports_categories::SportsCategories, staking_strategies::StakingStrategies, team_bet_types::TeamBetTypes};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct BacktestFeatureMapRequest {
    pub sports_category: SportsCategories,
    pub season: u32,
    pub season_type: SeasonType, 
    pub team_id: f64,
    pub team_bet_type: Option<TeamBetTypes>,
    pub player_bet_type: Option<PlayerBetTypes>,
    pub staking_strategy: StakingStrategies,
    pub odds_source: String,
    pub bank_roll: f64,
    pub model: String,
    pub player_id: Option<f64>,
}