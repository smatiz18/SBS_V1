use std::fmt;

use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[allow(warnings)]
pub enum TeamBetTypes {
    h2h,
    spreads,
    totals
}

impl fmt::Display for TeamBetTypes {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            TeamBetTypes::h2h => write!(f, "h2h"),
            TeamBetTypes::spreads => write!(f, "spreads"),
            TeamBetTypes::totals => write!(f, "totals")
        }
    }
}