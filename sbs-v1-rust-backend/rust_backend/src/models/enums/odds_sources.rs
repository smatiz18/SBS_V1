use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum OddsSources {
    FanDuel,
    DraftKings,
    BetMGM
}