use std::fmt;

use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum Bookmakers {
    FanDuel,
    DraftKings,
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