use serde::Deserialize;

use crate::models::enums::{ bet_types::BetTypes, sports_categories::SportsCategories, staking_strategies::StakingStrategies};

#[derive(Debug, Deserialize)]
pub struct BacktestFeatureMapRequest {
    pub sports_category: SportsCategories,
    pub season: f64,
    pub teamId: f64,
    pub betType: BetTypes,
    pub stakingStrategy: StakingStrategies,
    pub oddsSource: String,
    pub bankRoll: f64,
    pub model: String,
    pub playerId: Option<f64>
}