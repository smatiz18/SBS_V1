use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NbaGamesAvgsHistorical {
    #[serde(rename = "_id")]
    pub mongo_id: String,
    
    #[serde(rename = "teamId")]
    pub team_id: f64,
    
    pub season: u32,
    
    #[serde(rename = "seasonType")]
    pub season_type: String,
    
    #[serde(rename = "teamName")]
    pub team_name: String,
    
    #[serde(rename = "teamNickname")]
    pub team_nickname: String,
    
    #[serde(rename = "gameStats")]
    pub game_stats: HashMap<String, GameStats>,
    
    #[serde(rename = "expandingAvg")]
    pub expanding_avg: HashMap<String, GameStats>,
    
    #[serde(rename = "rollingAvg5")]
    pub rolling_avg_5: HashMap<String, GameStats>,
    
    #[serde(rename = "rollingAvg10")]
    pub rolling_avg_10: HashMap<String, GameStats>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GameStats {
    pub points: u32,

    #[serde(rename = "linescoreQ1")]
    pub linescore_q1: u32,

    #[serde(rename = "linescoreQ2")]
    pub linescore_q2: u32,

    #[serde(rename = "linescoreQ3")]
    pub linescore_q3: u32,

    #[serde(rename = "linescoreQ4")]
    pub linescore_q4: u32,

    #[serde(rename = "gameId")]
    pub game_id: u32,

    #[serde(rename = "dateStart")]
    pub date_start: DateTime<Utc>, 
}