use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc}; 

#[derive(Serialize, Deserialize, Debug)]
pub struct NbaGamesHistorical {
    #[serde(rename = "_id")]
    mongoId: f64,
    id: f64,
    league: Option<String>,
    season: f64,
    dateStart: DateTime<Utc>,
    teamsVisitorsId: f64,
    teamsVisitorsNickname: String,
    teamsVisitorsCode: String,
    teamsHomeId: f64,
    teamsHomeName: String,
    teamsHomeNickname: String,
    teamsHomeCode: String,
    scoresVisitorsLinescore: Vec<String>,
    scoresVisitorsPoints: f64,
    scoresHomeLinescore: Vec<String>,
    scoresHomePoints :f64
}