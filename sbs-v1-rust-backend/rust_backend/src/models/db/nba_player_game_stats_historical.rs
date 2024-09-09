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
    min: Option<f64>,
    fgm: Option<f64>,
    fga: Option<f64>,
    fgp: Option<f64>,
    ftm: Option<f64>,
    fta: Option<f64>,
    ftp: Option<f64>,
    tpm: Option<f64>,
    tpa: Option<f64>,
    tpp: Option<f64>,
    offReb: Option<f64>,
    defReb: Option<f64>,
    totReb: Option<u32>,
    assists: Option<f64>,
    pFouls: Option<f64>,
    steals: Option<f64>,
    turnovers: Option<f64>,
    blocks: Option<f64>,
    plusMinus: Option<f64>,
    playerId: Option<f64>,
    playerFirstname: Option<String>,
    playerLastname: Option<String>,
    teamId: Option<u32>,
    gameId: Option<u32>,
    dateStart: Option<DateTime<Utc>>
} 