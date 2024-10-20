use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Serialize, Deserialize, Clone)]
pub struct NbaOddsHistorical {
    #[serde(rename = "_id")]
    pub mongo_id: String,
    
    #[serde(rename = "sportKey")]
    pub sport_key: String,
    
    #[serde(rename = "sportTitle")]
    pub sport_title: String,
    
    #[serde(rename = "awayTeam")]
    pub away_team: String,
    
    #[serde(rename = "nbaApiId")]
    pub nba_api_id: u32,
    
    #[serde(rename = "oddsApiId")]
    pub odds_api_id: String,
    
    #[serde(rename = "dateStart")]
    pub date_start: DateTime<Utc>,
    
    pub season: u32,
    
    #[serde(rename = "bookmakerOdds")]
    pub bookmaker_odds: Vec<BookmakerOdds>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct BookmakerOdds {
    pub key: String,
    
    pub title: String,
    
    #[serde(rename = "lastUpdate")]
    pub last_update: DateTime<Utc>,
    
    pub markets: Vec<Market>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Market {
    pub key: String,
    
    #[serde(rename = "lastUpdate")]
    pub last_update: DateTime<Utc>,
    
    pub outcomes: Vec<Outcome>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Outcome {
    pub name: String,
    
    pub price: i32,
    
    pub description: Option<String>,
    
    pub point: Option<f64>,
}