use std::fmt;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum OddsApiRegions {
    US
}


impl fmt::Display for OddsApiRegions {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            OddsApiRegions::US => write!(f, "us"),
        }
    }
}