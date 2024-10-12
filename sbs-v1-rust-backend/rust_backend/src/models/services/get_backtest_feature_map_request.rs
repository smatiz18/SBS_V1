pub struct BacktestFeatureMapRequest {
    pub sports_category: SportsCategories,
    pub season: f64,
    pub team_id: f64,
    pub bet_type: String,
    pub staking_strategy: String,
    pub odds_source: String,
    pub bank_roll: f64,
    pub model: String;
    pub Option<player_id>: f64
}