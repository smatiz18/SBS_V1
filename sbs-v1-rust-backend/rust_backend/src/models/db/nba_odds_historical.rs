use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Serialize, Deserialize)]
pub struct NbaOddsHistorical {
    #[serde(rename = "_id")]
    mongoId: u32,
    sportKey: String,
    sportTitle: String,
    awayTeam: String,
    nbaApiId: u32,
    oddsApiId: u32,
    dateStart: DateTime<Utc>,
    season: u32,
    bookmakerOdds: Vec<BookmakerOdds>
}

#[derive(Serialize, Deserialize)]
pub struct BookmakerOdds {
    key: String,
    title: String,
    lastUpdate: DateTime<Utc>,
    markets: Vec<Market>
}

#[derive(Serialize, Deserialize)]
pub struct Market {
    key: String,
    lastUpdate: DateTime<Utc>,
    outcomes: Vec<Outcome>
}

#[derive(Serialize, Deserialize)]
pub struct Outcome {
    name: String,
    price: i32
}


