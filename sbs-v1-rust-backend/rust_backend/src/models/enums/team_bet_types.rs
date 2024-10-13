use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub enum TeamBetTypes {
    h2h,
    spreads,
    totals
}