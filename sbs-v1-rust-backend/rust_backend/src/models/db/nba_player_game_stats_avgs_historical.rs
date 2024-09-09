use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use super::nba_player_game_stats_historical::PlayerStatsObj;
use crate::models::season_type::SeasonType;

#[derive(Serialize, Deserialize)]
pub struct NbaPlayerGameStatsAvgsHistorical {
    #[serde(rename = "_id")]
    mongoId: String,
    playerId: u32,
    teamId: u32,
    season: String, 
    seasonType: String, 
    firstname: String,
    lastname: String,
    birthday: Option<DateTime<Utc>>,
    countryOfBirth: Option<String>,
    playerStats: HashMap<String, PlayerStatsObj>,
    expandingAvg: HashMap<String, PlayerStatsObj>,
    rollingAvg5: HashMap<String, PlayerStatsObj>,
    rollingAvg10: HashMap<String, PlayerStatsObj>
}