use core::fmt;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum OddsApiSports {
    BasketballNba
}

impl fmt::Display for OddsApiSports {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            OddsApiSports::BasketballNba => write!(f, "basketball_nba"),
        }
    }
}