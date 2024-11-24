use std::{fmt, str::FromStr};

use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum SeasonType {
    REGULAR,
    PLAYOFF,
    ALL,
}

impl fmt::Display for SeasonType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            SeasonType::REGULAR => write!(f, "REGULAR"),
            SeasonType::PLAYOFF => write!(f, "PLAYOFF"),
            SeasonType::ALL => write!(f, "ALL")
        }
    }
}

impl FromStr for SeasonType {
    type Err = String; // Define the error type

    fn from_str(input: &str) -> Result<Self, Self::Err> {
        match input {
            "REGULAR" => Ok(SeasonType::REGULAR),
            "PLAYOFF" => Ok(SeasonType::PLAYOFF),
            "ALL" => Ok(SeasonType::ALL),
            _ => Err(format!("'{}' is not a valid variant", input)),
        }
    }
}