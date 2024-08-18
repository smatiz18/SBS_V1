use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use super::nba_player_game_stats_historical::PlayerStatsObj;

#[derive(Serialize, Deserialize)]
pub struct NbaPlayerGameStatsAvgsHistorical {
    #[serde(rename = "_id")]
    mongoId: String,
    playerId: u32,
    teamId: u32,
    seasonType: String,
    firstname: String,
    lastname: String,
    birthday: Option<DateTime<Utc>>,
    countryOfBirth: Option<String>,
    playerStats: HashMap<u32, PlayerStatsObj>,
    expandingAvg: HashMap<u32, PlayerStatsObj>,
    rollingAvg5: HashMap<u32, PlayerStatsObj>,
    rollingAvg10: HashMap<u32, PlayerStatsObj>
}