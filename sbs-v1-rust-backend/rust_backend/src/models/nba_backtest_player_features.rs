use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NbaBacktestPlayerFeatures {
    #[serde(rename = "dateStart")]
    pub date_start: DateTime<Utc>,
    
    #[serde(rename = "teamId")]
    pub team_id: f64,
    
    #[serde(rename = "opponentTeamId")]
    pub opponent_team_id: f64,

    pub age: f64,

    /* player stats */
    pub points: f64,
    
    pub min: f64,
    
    pub fgm: f64,
    
    pub fga: f64,
    
    pub fgp: f64,
    
    pub ftm: f64,
    
    pub fta: f64,
    
    pub ftp: f64,
    
    pub tpm: f64,
    
    pub tpa: f64,
    
    pub tpp: f64,
    
    #[serde(rename = "offReb")]
    pub off_reb: f64,
    
    #[serde(rename = "defReb")]
    pub def_reb: f64,
    
    #[serde(rename = "totReb")]
    pub tot_reb: f64,
    
    pub assists: f64,
    
    #[serde(rename = "pFouls")]
    pub p_fouls: f64,
    
    pub steals: f64,
    
    pub turnovers: f64,
    
    pub blocks: f64,
    
    #[serde(rename = "plusMinus")]
    pub plus_minus: f64,
    
    /* Expanding Average Fields */
    #[serde(rename = "expandingAvgPoints")]
    pub expanding_avg_points: f64,
    
    #[serde(rename = "expandingAvgMin")]
    pub expanding_avg_min: f64,
    
    #[serde(rename = "expandingAvgFgm")]
    pub expanding_avg_fgm: f64,
    
    #[serde(rename = "expandingAvgFga")]
    pub expanding_avg_fga: f64,
    
    #[serde(rename = "expandingAvgFgp")]
    pub expanding_avg_fgp: f64,
    
    #[serde(rename = "expandingAvgFtm")]
    pub expanding_avg_ftm: f64,
    
    #[serde(rename = "expandingAvgFta")]
    pub expanding_avg_fta: f64,
    
    #[serde(rename = "expandingAvgFtp")]
    pub expanding_avg_ftp: f64,
    
    #[serde(rename = "expandingAvgTpm")]
    pub expanding_avg_tpm: f64,
    
    #[serde(rename = "expandingAvgTpa")]
    pub expanding_avg_tpa: f64,
    
    #[serde(rename = "expandingAvgTpp")]
    pub expanding_avg_tpp: f64,
    
    #[serde(rename = "expandingAvgOffReb")]
    pub expanding_avg_off_reb: f64,
    
    #[serde(rename = "expandingAvgDefReb")]
    pub expanding_avg_def_reb: f64,
    
    #[serde(rename = "expandingAvgTotReb")]
    pub expanding_avg_tot_reb: f64,
    
    #[serde(rename = "expandingAvgAssists")]
    pub expanding_avg_assists: f64,
    
    #[serde(rename = "expandingAvgPFouls")]
    pub expanding_avg_p_fouls: f64,
    
    #[serde(rename = "expandingAvgSteals")]
    pub expanding_avg_steals: f64,
    
    #[serde(rename = "expandingAvgTurnovers")]
    pub expanding_avg_turnovers: f64,
    
    #[serde(rename = "expandingAvgBlocks")]
    pub expanding_avg_blocks: f64,
    
    #[serde(rename = "expandingAvgPlusMinus")]
    pub expanding_avg_plus_minus: f64,

    /* 5-Game Moving Average Fields */
    #[serde(rename = "rollingAvg5Points")]
    pub rolling_avg_5_points: f64,
    
    #[serde(rename = "rollingAvg5Min")]
    pub rolling_avg_5_min: f64,
    
    #[serde(rename = "rollingAvg5Fgm")]
    pub rolling_avg_5_fgm: f64,
    
    #[serde(rename = "rollingAvg5Fga")]
    pub rolling_avg_5_fga: f64,
    
    #[serde(rename = "rollingAvg5Fgp")]
    pub rolling_avg_5_fgp: f64,
    
    #[serde(rename = "rollingAvg5Ftm")]
    pub rolling_avg_5_ftm: f64,
    
    #[serde(rename = "rollingAvg5Fta")]
    pub rolling_avg_5_fta: f64,
    
    #[serde(rename = "rollingAvg5Ftp")]
    pub rolling_avg_5_ftp: f64,
    
    #[serde(rename = "rollingAvg5Tpm")]
    pub rolling_avg_5_tpm: f64,
    
    #[serde(rename = "rollingAvg5Tpa")]
    pub rolling_avg_5_tpa: f64,
    
    #[serde(rename = "rollingAvg5Tpp")]
    pub rolling_avg_5_tpp: f64,
    
    #[serde(rename = "rollingAvg5OffReb")]
    pub rolling_avg_5_off_reb: f64,
    
    #[serde(rename = "rollingAvg5DefReb")]
    pub rolling_avg_5_def_reb: f64,
    
    #[serde(rename = "rollingAvg5TotReb")]
    pub rolling_avg_5_tot_reb: f64,
    
    #[serde(rename = "rollingAvg5Assists")]
    pub rolling_avg_5_assists: f64,
    
    #[serde(rename = "rollingAvg5PFouls")]
    pub rolling_avg_5_p_fouls: f64,
    
    #[serde(rename = "rollingAvg5Steals")]
    pub rolling_avg_5_steals: f64,
    
    #[serde(rename = "rollingAvg5Turnovers")]
    pub rolling_avg_5_turnovers: f64,
    
    #[serde(rename = "rollingAvg5Blocks")]
    pub rolling_avg_5_blocks: f64,
    
    #[serde(rename = "rollingAvg5PlusMinus")]
    pub rolling_avg_5_plus_minus: f64,

    /* 10-Game Moving Average Fields */
    #[serde(rename = "rollingAvg10Points")]
    pub rolling_avg_10_points: f64,
    
    #[serde(rename = "rollingAvg10Min")]
    pub rolling_avg_10_min: f64,
    
    #[serde(rename = "rollingAvg10Fgm")]
    pub rolling_avg_10_fgm: f64,
    
    #[serde(rename = "rollingAvg10Fga")]
    pub rolling_avg_10_fga: f64,
    
    #[serde(rename = "rollingAvg10Fgp")]
    pub rolling_avg_10_fgp: f64,
    
    #[serde(rename = "rollingAvg10Ftm")]
    pub rolling_avg_10_ftm: f64,
    
    #[serde(rename = "rollingAvg10Fta")]
    pub rolling_avg_10_fta: f64,
    
    #[serde(rename = "rollingAvg10Ftp")]
    pub rolling_avg_10_ftp: f64,
    
    #[serde(rename = "rollingAvg10Tpm")]
    pub rolling_avg_10_tpm: f64,
    
    #[serde(rename = "rollingAvg10Tpa")]
    pub rolling_avg_10_tpa: f64,
    
    #[serde(rename = "rollingAvg10Tpp")]
    pub rolling_avg_10_tpp: f64,
    
    #[serde(rename = "rollingAvg10OffReb")]
    pub rolling_avg_10_off_reb: f64,
    
    #[serde(rename = "rollingAvg10DefReb")]
    pub rolling_avg_10_def_reb: f64,
    
    #[serde(rename = "rollingAvg10TotReb")]
    pub rolling_avg_10_tot_reb: f64,
    
    #[serde(rename = "rollingAvg10Assists")]
    pub rolling_avg_10_assists: f64,
    
    #[serde(rename = "rollingAvg10PFouls")]
    pub rolling_avg_10_p_fouls: f64,
    
    #[serde(rename = "rollingAvg10Steals")]
    pub rolling_avg_10_steals: f64,
    
    #[serde(rename = "rollingAvg10Turnovers")]
    pub rolling_avg_10_turnovers: f64,
    
    #[serde(rename = "rollingAvg10Blocks")]
    pub rolling_avg_10_blocks: f64,
    
    #[serde(rename = "rollingAvg10PlusMinus")]
    pub rolling_avg_10_plus_minus: f64,
}