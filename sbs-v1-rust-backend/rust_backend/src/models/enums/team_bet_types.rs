use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[allow(warnings)]
pub enum TeamBetTypes {
    h2h,
    spreads,
    totals
}