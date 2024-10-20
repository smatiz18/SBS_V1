use serde::Serialize;

#[derive(Serialize, Debug, Clone)]
pub struct NbaBacktestPlayerFeatureMap {
    #[serde(rename = "gameNumber")]
    game_number: f64,
    
    #[serde(rename = "teamId")]
    team_id: f64,
    
    #[serde(rename = "opponentTeamId")]
    opponent_team_id: f64,

    age: i32,

    /* player stats */
    pub points: Option<f64>,
    
    pub pos: Option<String>,
    
    pub min: Option<f64>,
    
    pub fgm: Option<f64>,
    
    pub fga: Option<f64>,
    
    pub fgp: Option<f64>,
    
    pub ftm: Option<f64>,
    
    pub fta: Option<f64>,
    
    pub ftp: Option<f64>,
    
    pub tpm: Option<f64>,
    
    pub tpa: Option<f64>,
    
    pub tpp: Option<f64>,
    
    #[serde(rename = "offReb")]
    pub off_reb: Option<f64>,
    
    #[serde(rename = "defReb")]
    pub def_reb: Option<f64>,
    
    #[serde(rename = "totReb")]
    pub tot_reb: Option<f64>,
    
    pub assists: Option<f64>,
    
    #[serde(rename = "pFouls")]
    pub p_fouls: Option<f64>,
    
    pub steals: Option<f64>,
    
    pub turnovers: Option<f64>,
    
    pub blocks: Option<f64>,
    
    #[serde(rename = "plusMinus")]
    pub plus_minus: Option<f64>,
    
    /* Expanding Average Fields */
    #[serde(rename = "expandingAvgPoints")]
    pub expanding_avg_points: Option<f64>,
    
    #[serde(rename = "expandingAvgMin")]
    pub expanding_avg_min: Option<f64>,
    
    #[serde(rename = "expandingAvgFgm")]
    pub expanding_avg_fgm: Option<f64>,
    
    #[serde(rename = "expandingAvgFga")]
    pub expanding_avg_fga: Option<f64>,
    
    #[serde(rename = "expandingAvgFgp")]
    pub expanding_avg_fgp: Option<f64>,
    
    #[serde(rename = "expandingAvgFtm")]
    pub expanding_avg_ftm: Option<f64>,
    
    #[serde(rename = "expandingAvgFta")]
    pub expanding_avg_fta: Option<f64>,
    
    #[serde(rename = "expandingAvgFtp")]
    pub expanding_avg_ftp: Option<f64>,
    
    #[serde(rename = "expandingAvgTpm")]
    pub expanding_avg_tpm: Option<f64>,
    
    #[serde(rename = "expandingAvgTpa")]
    pub expanding_avg_tpa: Option<f64>,
    
    #[serde(rename = "expandingAvgTpp")]
    pub expanding_avg_tpp: Option<f64>,
    
    #[serde(rename = "expandingAvgOffReb")]
    pub expanding_avg_off_reb: Option<f64>,
    
    #[serde(rename = "expandingAvgDefReb")]
    pub expanding_avg_def_reb: Option<f64>,
    
    #[serde(rename = "expandingAvgTotReb")]
    pub expanding_avg_tot_reb: Option<f64>,
    
    #[serde(rename = "expandingAvgAssists")]
    pub expanding_avg_assists: Option<f64>,
    
    #[serde(rename = "expandingAvgPFouls")]
    pub expanding_avg_p_fouls: Option<f64>,
    
    #[serde(rename = "expandingAvgSteals")]
    pub expanding_avg_steals: Option<f64>,
    
    #[serde(rename = "expandingAvgTurnovers")]
    pub expanding_avg_turnovers: Option<f64>,
    
    #[serde(rename = "expandingAvgBlocks")]
    pub expanding_avg_blocks: Option<f64>,
    
    #[serde(rename = "expandingAvgPlusMinus")]
    pub expanding_avg_plus_minus: Option<f64>,

    /* 5-Game Moving Average Fields */
    #[serde(rename = "rollingAvg5Points")]
    pub rolling_avg_5_points: Option<f64>,
    
    #[serde(rename = "rollingAvg5Min")]
    pub rolling_avg_5_min: Option<f64>,
    
    #[serde(rename = "rollingAvg5Fgm")]
    pub rolling_avg_5_fgm: Option<f64>,
    
    #[serde(rename = "rollingAvg5Fga")]
    pub rolling_avg_5_fga: Option<f64>,
    
    #[serde(rename = "rollingAvg5Fgp")]
    pub rolling_avg_5_fgp: Option<f64>,
    
    #[serde(rename = "rollingAvg5Ftm")]
    pub rolling_avg_5_ftm: Option<f64>,
    
    #[serde(rename = "rollingAvg5Fta")]
    pub rolling_avg_5_fta: Option<f64>,
    
    #[serde(rename = "rollingAvg5Ftp")]
    pub rolling_avg_5_ftp: Option<f64>,
    
    #[serde(rename = "rollingAvg5Tpm")]
    pub rolling_avg_5_tpm: Option<f64>,
    
    #[serde(rename = "rollingAvg5Tpa")]
    pub rolling_avg_5_tpa: Option<f64>,
    
    #[serde(rename = "rollingAvg5Tpp")]
    pub rolling_avg_5_tpp: Option<f64>,
    
    #[serde(rename = "rollingAvg5OffReb")]
    pub rolling_avg_5_off_reb: Option<f64>,
    
    #[serde(rename = "rollingAvg5DefReb")]
    pub rolling_avg_5_def_reb: Option<f64>,
    
    #[serde(rename = "rollingAvg5TotReb")]
    pub rolling_avg_5_tot_reb: Option<f64>,
    
    #[serde(rename = "rollingAvg5Assists")]
    pub rolling_avg_5_assists: Option<f64>,
    
    #[serde(rename = "rollingAvg5PFouls")]
    pub rolling_avg_5_p_fouls: Option<f64>,
    
    #[serde(rename = "rollingAvg5Steals")]
    pub rolling_avg_5_steals: Option<f64>,
    
    #[serde(rename = "rollingAvg5Turnovers")]
    pub rolling_avg_5_turnovers: Option<f64>,
    
    #[serde(rename = "rollingAvg5Blocks")]
    pub rolling_avg_5_blocks: Option<f64>,
    
    #[serde(rename = "rollingAvg5PlusMinus")]
    pub rolling_avg_5_plus_minus: Option<f64>,

    /* 10-Game Moving Average Fields */
    #[serde(rename = "rollingAvg10Points")]
    pub rolling_avg_10_points: Option<f64>,
    
    #[serde(rename = "rollingAvg10Min")]
    pub rolling_avg_10_min: Option<f64>,
    
    #[serde(rename = "rollingAvg10Fgm")]
    pub rolling_avg_10_fgm: Option<f64>,
    
    #[serde(rename = "rollingAvg10Fga")]
    pub rolling_avg_10_fga: Option<f64>,
    
    #[serde(rename = "rollingAvg10Fgp")]
    pub rolling_avg_10_fgp: Option<f64>,
    
    #[serde(rename = "rollingAvg10Ftm")]
    pub rolling_avg_10_ftm: Option<f64>,
    
    #[serde(rename = "rollingAvg10Fta")]
    pub rolling_avg_10_fta: Option<f64>,
    
    #[serde(rename = "rollingAvg10Ftp")]
    pub rolling_avg_10_ftp: Option<f64>,
    
    #[serde(rename = "rollingAvg10Tpm")]
    pub rolling_avg_10_tpm: Option<f64>,
    
    #[serde(rename = "rollingAvg10Tpa")]
    pub rolling_avg_10_tpa: Option<f64>,
    
    #[serde(rename = "rollingAvg10Tpp")]
    pub rolling_avg_10_tpp: Option<f64>,
    
    #[serde(rename = "rollingAvg10OffReb")]
    pub rolling_avg_10_off_reb: Option<f64>,
    
    #[serde(rename = "rollingAvg10DefReb")]
    pub rolling_avg_10_def_reb: Option<f64>,
    
    #[serde(rename = "rollingAvg10TotReb")]
    pub rolling_avg_10_tot_reb: Option<f64>,
    
    #[serde(rename = "rollingAvg10Assists")]
    pub rolling_avg_10_assists: Option<f64>,
    
    #[serde(rename = "rollingAvg10PFouls")]
    pub rolling_avg_10_p_fouls: Option<f64>,
    
    #[serde(rename = "rollingAvg10Steals")]
    pub rolling_avg_10_steals: Option<f64>,
    
    #[serde(rename = "rollingAvg10Turnovers")]
    pub rolling_avg_10_turnovers: Option<f64>,
    
    #[serde(rename = "rollingAvg10Blocks")]
    pub rolling_avg_10_blocks: Option<f64>,
    
    #[serde(rename = "rollingAvg10PlusMinus")]
    pub rolling_avg_10_plus_minus: Option<f64>,
}