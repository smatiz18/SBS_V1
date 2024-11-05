use std::fmt;
use serde::{Serialize, Deserialize};
use strum_macros::EnumString;

#[derive(Serialize, Deserialize, Debug, Clone, EnumString)]
pub enum Bookmakers {
    #[strum(serialize = "FanDuel")]
    FanDuel,
    #[strum(serialize = "DraftKings")]
    DraftKings,
    #[strum(serialize = "BetMGM")]
    BetMGM
}

impl fmt::Display for Bookmakers {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Bookmakers::FanDuel => write!(f, "fanduel"),
            Bookmakers::DraftKings => write!(f, "draftkings"),
            Bookmakers::BetMGM => write!(f, "betmgm")
        }
    }
}