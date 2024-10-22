use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize,Debug, Clone)]
pub struct NbaBacktestTeamFeatures {
    pub win: i32,

    #[serde(rename = "predictorTeamId")]
    pub predictor_team_id: f64,

    #[serde(rename = "teamsVisitorsId")]
    pub teams_visitors_id: f64,
    
    #[serde(rename = "teamsHomeId")]
    pub teams_home_id: f64,

    #[serde(rename = "dateStart")]
    pub date_start: DateTime<Utc>,

    /* Actual Scores */
    #[serde(rename = "linescoreQ1")]
    pub linescore_q1: u32,

    #[serde(rename = "linescoreQ2")]
    pub linescore_q2: u32,
    
    #[serde(rename = "lincescoreQ3")]
    pub linescore_q3: u32,
    
    #[serde(rename = "lQ4")]
    pub linescore_q4: u32,

    /* Expanding Avgs */
    #[serde(rename = "expandingAvgLinescoreQ1")]
    pub expanding_avg_linescore_q1: u32,

    #[serde(rename = "expandingAvgLinescoreQ2")]
    pub expanding_avg_linescore_q2: u32,

    #[serde(rename = "expandingAvgLinescoreQ3")]
    pub expanding_avg_linescore_q3: u32,

    #[serde(rename = "expandingAvgLinescoreQ4")]
    pub expanding_avg_linescore_q4: u32,

    /* 5-Day Moving Avgs */
    #[serde(rename = "rollingAvg5LinescoreQ1")]
    pub rolling_avg_5_linescore_q1: u32,

    #[serde(rename = "rollingAvg5LinescoreQ2")]
    pub rolling_avg_5_linescore_q2: u32,

    #[serde(rename = "rollingAvg5LinescoreQ3")]
    pub rolling_avg_5_linescore_q3: u32,

    #[serde(rename = "rollingAvg5LinescoreQ4")]
    pub rolling_avg_5_linescore_q4: u32,

    /* 10-Day Moving Avgs */
    #[serde(rename = "rollingAvg10LinescoreQ1")]
    pub rolling_avg_10_linescore_q1: u32,

    #[serde(rename = "rollingAvg10LinescoreQ2")]
    pub rolling_avg_10_linescore_q2: u32,

    #[serde(rename = "rollingAvg10LinescoreQ3")]
    pub rolling_avg_10_linescore_q3: u32,

    #[serde(rename = "rollingAvg10LinescoreQ4")]
    pub rolling_avg_10_linescore_q4: u32,
}