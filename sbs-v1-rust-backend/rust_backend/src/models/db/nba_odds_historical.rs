use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

use crate::models::odds_api::odds::Bookmaker;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NbaOddsHistorical {
    #[serde(rename = "_id")]
    pub mongo_id: String,
    pub sport_key: String,
    pub sport_title: String,
    pub away_team: String,
    pub nba_api_id: u32,
    pub odds_api_id: String,
    pub date_start: DateTime<Utc>,
    pub season: u32,
    pub bookmaker_odds: Vec<Bookmaker>,
}