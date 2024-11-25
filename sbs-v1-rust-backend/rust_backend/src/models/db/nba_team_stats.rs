use serde::{Deserialize, Serialize};
use crate::models::enums::season_type::SeasonType;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NbaTeamStats {
    #[serde(rename = "_id")]
    pub mongo_id: String,
    pub team_id: f64,
    pub team_name: String,
    pub team_nickname: String,
    pub season: u32,
    pub season_type: SeasonType,
    pub last_game_id: u32,
    
    pub total_streak: String,
    pub home_streak: String,
    pub away_streak: String,

    pub total_wins: u32,
    pub total_losses: u32,
    pub last_ten_total_wins: u32,
    pub last_ten_total_losses: u32,

    pub home_wins: u32,
    pub home_losses: u32,
    pub last_ten_home_wins: u32,
    pub last_ten_home_losses: u32,
   
    pub away_wins: u32,
    pub away_losses: u32,
    pub last_ten_away_wins: u32,
    pub last_ten_away_losses: u32,
}