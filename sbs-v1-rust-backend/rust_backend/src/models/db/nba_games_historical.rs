use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc}; 

#[derive(Serialize, Deserialize, Debug)]
pub struct NbaGamesHistorical {
    #[serde(rename = "_id")]
    mongoId: f32,
    id: f32,
    league: Option<String>,
    season: f32,
    dateStart: DateTime<Utc>,
    teamsVisitorsId: f32,
    teamsVisitorsNickname: String,
    teamsVisitorsCode: String,
    teamsHomeId: f32,
    teamsHomeName: String,
    teamsHomeNickname: String,
    teamsHomeCode: String,
    scoresVisitorsLinescore: Vec<String>,
    scoresVisitorsPoints: f32,
    scoresHomeLinescore: Vec<String>,
    scoresHomePoints :f32
}