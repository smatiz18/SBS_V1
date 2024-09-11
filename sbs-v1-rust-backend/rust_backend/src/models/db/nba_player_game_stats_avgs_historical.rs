use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use super::nba_player_game_stats_historical::PlayerStatsObj;

#[derive(Serialize, Deserialize)]
pub struct NbaPlayerGameStatsAvgsHistorical {
    #[serde(rename = "_id")]
    mongoId: String,
    playerId: u32,
    teamId: Option<u32>,
    season: Option<String>, 
    seasonType: Option<String>, 
    firstname: Option<String>,
    lastname: Option<String>,
    birthday: Option<String>,
    countryOfBirth: Option<String>,
    playerStats: Option<HashMap<String, PlayerStatsObj>>,
    expandingAvg: Option<HashMap<String, PlayerStatsObj>>,
    rollingAvg5: Option<HashMap<String, PlayerStatsObj>>,
    rollingAvg10: Option<HashMap<String, PlayerStatsObj>>
}