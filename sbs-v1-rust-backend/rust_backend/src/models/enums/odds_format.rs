use std::fmt;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum OddsFormat {
    American
}

impl fmt::Display for OddsFormat {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            OddsFormat::American => write!(f, "american"),
        }
    }
}