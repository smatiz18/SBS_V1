use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Event {
    pub id: String,
    pub sport_key: String,
    pub sport_title: String,
    pub commence_time: DateTime<Utc>,
    pub home_team: String,
    pub away_team: String,
    pub bookmakers: Vec<Bookmaker>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Bookmaker {
    pub key: String,
    pub title: String,
    pub last_update: DateTime<Utc>,
    pub markets: Vec<Market>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Market {
    pub key: String,
    pub last_update: DateTime<Utc>,
    pub outcomes: Vec<Outcome>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Outcome {
    pub name: String,
    pub price: f64,
    pub description: Option<String>,
    pub point: Option<f64>,
}
