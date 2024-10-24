use serde::{Deserialize, Serialize};

use crate::models::enums::{player_bet_types::PlayerBetTypes, season_type::SeasonType, sports_categories::SportsCategories, staking_strategies::StakingStrategies, team_bet_types::TeamBetTypes};

#[derive(Serialize, Deserialize, Clone)]
pub struct BacktestFeatureMapRequest {
    #[serde(rename = "sportsCategory")]
    pub sports_category: SportsCategories,

    pub season: u32,

    #[serde(rename = "seasonType")]
    pub season_type: SeasonType, 

    #[serde(rename = "teamId")]
    pub team_id: f64,

    #[serde(rename = "teamBetType")]
    pub team_bet_type: Option<TeamBetTypes>,

    #[serde(rename = "playerBetType")]
    pub player_bet_type: Option<PlayerBetTypes>,

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