use std::fmt;

use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum BookMakers {
    FanDuel,
    DraftKings,
    BetMGM
}

impl fmt::Display for BookMakers {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            BookMakers::FanDuel => write!(f, "fanduel"),
            BookMakers::DraftKings => write!(f, "draftkings"),
            BookMakers::BetMGM => write!(f, "betmgm")
        }
    }
}