use serde::Deserialize;

use crate::models::enums::{bookmakers::Bookmakers, odds_api_regions::OddsApiRegions, odds_api_sports::OddsApiSports, odds_format::OddsFormat};

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GetOddsRequest {
    pub sports: OddsApiSports,
    pub regions: OddsApiRegions,
    pub markets: Vec<String>,
    pub odds_format: OddsFormat,
    pub bookmakers: Vec<Bookmakers>
}