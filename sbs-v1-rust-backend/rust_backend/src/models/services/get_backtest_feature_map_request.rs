use crate::models::enums::{sports_categories::SportsCategories, staking_strategies::StakingStrategies};

pub struct BacktestFeatureMapRequest {
    pub sports_category: SportsCategories,
    pub season: f64,
    pub team_id: f64,
    pub bet_type: String,
    pub staking_strategy: StakingStrategies,
    pub odds_source: String,
    pub bank_roll: f64,
    pub model: String,
    pub player_id: Option<f64>
}