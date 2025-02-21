use std::collections::HashMap;
use serde::Serialize;
use crate::models::{aggregators::optimal_odds::OptimalOdds, odds::odds::Event};

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GetOddsResponse {
    pub events: Vec<Event>,
    pub team_optimal_odds_map: HashMap<String, Vec<OptimalOdds>>,
    pub player_optimal_odds_map: HashMap<String, HashMap<String, Vec<OptimalOdds>>>
}