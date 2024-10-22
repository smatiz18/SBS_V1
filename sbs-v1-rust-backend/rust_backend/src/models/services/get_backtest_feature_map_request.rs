use serde::{Deserialize, Serialize};

use crate::models::enums::{ bet_types::BetTypes, sports_categories::SportsCategories, staking_strategies::StakingStrategies};

#[derive(Serialize, Deserialize, Clone)]
pub struct BacktestFeatureMapRequest {
    #[serde(rename = "sportsCategory")]
    pub sports_category: SportsCategories,

    pub season: u32,

    #[serde(rename = "teamId")]
    pub team_id: f64,

    #[serde(rename = "betType")]
    pub bet_type: BetTypes,

    #[serde(rename = "stakingStrategy")]
    pub staking_strategy: StakingStrategies,

    #[serde(rename = "oddsSource")]
    pub odds_source: String,

    #[serde(rename = "bankRoll")]
    pub bank_roll: f64,

    pub model: String,

    #[serde(rename = "playerId")]
    pub player_id: Option<f64>,
}