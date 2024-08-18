use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Serialize, Deserialize)]
pub struct NbaPlayerGameStatsHistorical {
    #[serde(rename = "_id")]
    mongoId: String,
    teamsHomePlayers: HashMap<u32, PlayerStatsObj>,
    teamsVisitorsPlayers: HashMap<u32, PlayerStatsObj>,
    teamsHomeId: u32,
    teamsVisitorsId: u32,
    season: u32,
    dateStart: DateTime<Utc>
}

#[derive(Serialize, Deserialize)]
pub struct PlayerStatsObj {
    points: Option<u32>,
    pos: Option<String>,
    min: Option<u32>,
    fgm: Option<u32>,
    fga: Option<u32>,
    fgp: Option<u32>,
    ftm: Option<u32>,
    fta: Option<u32>,
    ftp: Option<u32>,
    tpm: Option<u32>,
    tpa: Option<u32>,
    tpp: Option<u32>,
    offReb: Option<u32>,
    defReb: Option<u32>,
    totReb: Option<u32>,
    assists: Option<u32>,
    pFouls: Option<u32>,
    steals: Option<u32>,
    turnovers: Option<u32>,
    blocks: Option<u32>,
    plusMinus: Option<i32>,
    playerId: Option<u32>,
    playerFirstname: Option<String>,
    playerLastname: Option<String>,
    teamId: Option<u32>,
    gameId: Option<u32>,
    dateStart: Option<DateTime<Utc>>
} 