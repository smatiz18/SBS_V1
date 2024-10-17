use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub enum OddsSources {
    FanDuel,
    DraftKings,
    BetMGM
}