use serde::Serialize;
use crate::models::enums::season_type::SeasonType;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NbaTeamStats {
    #[serde(rename = "_id")]
    pub mongo_id: String,
    pub team_id: f64,
    pub season: u32,
    pub season_type: SeasonType,
    pub last_game_id: u32,
    pub total_wins: u32,
    pub total_losses: u32,
    pub streak_type: Option<bool>,
    pub total_streak: i32,
    pub home_wins: u32,
    pub home_losses: u32,
    pub home_streak: i32,
    pub away_wins: u32,
    pub away_losses: u32,
    pub away_streak: i32
}