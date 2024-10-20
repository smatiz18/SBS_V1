use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc}; 

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NbaGamesHistorical {
    #[serde(rename = "_id")]
    pub mongo_id: f64,
    
    pub id: f64,
    
    pub league: Option<String>,
    
    pub season: f64,
    
    #[serde(rename = "dateStart")]
    pub date_start: DateTime<Utc>,
    
    #[serde(rename = "teamsVisitorsId")]
    pub teams_visitors_id: f64,
    
    #[serde(rename = "teamsVisitorsNickname")]
    pub teams_visitors_nickname: String,
    
    #[serde(rename = "teamsVisitorsCode")]
    pub teams_visitors_code: String,
    
    #[serde(rename = "teamsHomeId")]
    pub teams_home_id: f64,
    
    #[serde(rename = "teamsHomeName")]
    pub teams_home_name: String,
    
    #[serde(rename = "teamsHomeNickname")]
    pub teams_home_nickname: String,
    
    #[serde(rename = "teamsHomeCode")]
    pub teams_home_code: String,
    
    #[serde(rename = "scoresVisitorsLinescore")]
    pub scores_visitors_linescore: Vec<String>,
    
    #[serde(rename = "scoresVisitorsPoints")]
    pub scores_visitors_points: f64,
    
    #[serde(rename = "scoresHomeLinescore")]
    pub scores_home_linescore: Vec<String>,
    
    #[serde(rename = "scoresHomePoints")]
    pub scores_home_points: f64,
}