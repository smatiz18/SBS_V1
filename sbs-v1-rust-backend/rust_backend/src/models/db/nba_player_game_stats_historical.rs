use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Serialize, Deserialize, Clone)]
pub struct NbaPlayerGameStatsHistorical {
    #[serde(rename = "_id")]
    pub mongo_id: String,
    
    #[serde(rename = "teamsHomePlayers")]
    pub teams_home_players: HashMap<u32, PlayerStatsObj>,
    
    #[serde(rename = "teamsVisitorsPlayers")]
    pub teams_visitors_players: HashMap<u32, PlayerStatsObj>,
    
    #[serde(rename = "teamsHomeId")]
    pub teams_home_id: u32,
    
    #[serde(rename = "teamsVisitorsId")]
    pub teams_visitors_id: u32,
    
    pub season: u32,
    
    #[serde(rename = "dateStart")]
    pub date_start: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PlayerStatsObj {
    pub points: Option<f64>,
    
    pub pos: Option<String>,
    
    pub min: Option<f64>,
    
    pub fgm: Option<f64>,
    
    pub fga: Option<f64>,
    
    pub fgp: Option<f64>,
    
    pub ftm: Option<f64>,
    
    pub fta: Option<f64>,
    
    pub ftp: Option<f64>,
    
    pub tpm: Option<f64>,
    
    pub tpa: Option<f64>,
    
    pub tpp: Option<f64>,
    
    #[serde(rename = "offReb")]
    pub off_reb: Option<f64>,
    
    #[serde(rename = "defReb")]
    pub def_reb: Option<f64>,
    
    #[serde(rename = "totReb")]
    pub tot_reb: Option<f64>,
    
    pub assists: Option<f64>,
    
    #[serde(rename = "pFouls")]
    pub p_fouls: Option<f64>,
    
    pub steals: Option<f64>,
    
    pub turnovers: Option<f64>,
    
    pub blocks: Option<f64>,
    
    #[serde(rename = "plusMinus")]
    pub plus_minus: Option<f64>,
    
    #[serde(rename = "playerId")]
    pub player_id: Option<f64>,
    
    #[serde(rename = "playerFirstname")]
    pub player_firstname: Option<String>,
    
    #[serde(rename = "playerLastname")]
    pub player_lastname: Option<String>,
    
    #[serde(rename = "teamId")]
    pub team_id: Option<u32>,
    
    #[serde(rename = "gameId")]
    pub game_id: Option<u32>,
    
    #[serde(rename = "dateStart")]
    pub date_start: Option<DateTime<Utc>>,
}