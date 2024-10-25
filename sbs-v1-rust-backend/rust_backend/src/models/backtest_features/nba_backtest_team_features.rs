use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NbaBacktestTeamFeatures {
    pub win: i32,
    pub predictor_team_id: f64,
    pub teams_visitors_id: f64,
    pub teams_home_id: f64,
    pub date_start: DateTime<Utc>,

    /* Actual Scores */
    pub linescore_q1: f64,
    pub linescore_q2: f64,
    pub linescore_q3: f64,
    pub linescore_q4: f64,

    /* Expanding Avgs */    
    pub expanding_avg_linescore_q1: f64,
    pub expanding_avg_linescore_q2: f64,
    pub expanding_avg_linescore_q3: f64,
    pub expanding_avg_linescore_q4: f64,

    /* 5-Day Moving Avgs */
    pub rolling_avg_5_linescore_q1: f64,
    pub rolling_avg_5_linescore_q2: f64,
    pub rolling_avg_5_linescore_q3: f64,
    pub rolling_avg_5_linescore_q4: f64,

    /* 10-Day Moving Avgs */
    pub rolling_avg_10_linescore_q1: f64,
    pub rolling_avg_10_linescore_q2: f64,
    pub rolling_avg_10_linescore_q3: f64,
    pub rolling_avg_10_linescore_q4: f64,
}
