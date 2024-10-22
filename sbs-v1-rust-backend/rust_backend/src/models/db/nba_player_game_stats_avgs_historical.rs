use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use super::nba_player_game_stats_historical::PlayerStatsObj;

#[derive(Serialize, Deserialize, Clone)]
pub struct NbaPlayerGameStatsAvgsHistorical {
    #[serde(rename = "_id")]
    pub mongo_id: String,
    
    #[serde(rename = "playerId")]
    pub player_id: u32,
    
    #[serde(rename = "teamId")]
    pub team_id: f64,
    
    pub season: Option<String>,
    
    #[serde(rename = "seasonType")]
    pub season_type: Option<String>,
    
    pub firstname: Option<String>,
    
    pub lastname: Option<String>,
    
    pub birthday: Option<String>,
    
    #[serde(rename = "countryOfBirth")]
    pub country_of_birth: Option<String>,
    
    #[serde(rename = "playerStats")]
    pub player_stats: HashMap<String, PlayerStatsObj>,
    
    #[serde(rename = "expandingAvg")]
    pub expanding_avg: HashMap<String, PlayerStatsObj>,
    
    #[serde(rename = "rollingAvg5")]
    pub rolling_avg_5: HashMap<String, PlayerStatsObj>,
    
    #[serde(rename = "rollingAvg10")]
    pub rolling_avg_10: HashMap<String, PlayerStatsObj>,
}