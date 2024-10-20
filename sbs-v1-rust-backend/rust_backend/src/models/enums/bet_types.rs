use serde::{Serialize, Deserialize};

use super::{player_bet_types::PlayerBetTypes, team_bet_types::TeamBetTypes};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum BetTypes {
    PlayerBetTypes(PlayerBetTypes),
    TeamBetTypes(TeamBetTypes)
}