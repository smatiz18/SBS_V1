use serde::Deserialize;

use crate::models::enums::odds_api_sports::OddsApiSports;

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GetEventsRequest {
    pub sports: OddsApiSports
}