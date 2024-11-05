use serde::Serialize;
use crate::models::enums::bookmakers::Bookmakers;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct OptimalOdds {
    pub bookmaker: Bookmakers,
    pub name: String,
    pub price: f64,
    pub point: Option<f64>,
    pub bet_type: String
}