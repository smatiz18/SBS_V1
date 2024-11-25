use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NbaTeamAggGameStatsHistorical {
    #[serde(rename = "_id")]
    pub mongo_id: String,
    
    pub team_id: f64,
    
    pub season: u32,
    
    pub season_type: String,
    
    pub team_name: String,
    
    pub team_nickname: String,
    
    pub game_stats: HashMap<String, GameStats>
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GameStats {
    pub team_id: f64,
    
    pub linescore: Vec<f64>,

    pub points: f64,

    pub win: bool,

    pub date_start: DateTime<Utc>, 

    pub game_id: u32,

    pub is_home: bool
}