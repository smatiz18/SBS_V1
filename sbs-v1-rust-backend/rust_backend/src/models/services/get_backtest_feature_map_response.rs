use serde::Serialize;

use crate::models::enums::feature_maps::FeatureMaps;

#[derive(Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct BacktestFeatureMapResponse {
    pub error: Option<String>,
    pub team_feature_map: Option<FeatureMaps>,
    pub player_feature_map: Option<FeatureMaps>
}