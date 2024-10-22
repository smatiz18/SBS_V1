use serde::Serialize;

use crate::models::enums::feature_maps::FeatureMaps;

#[derive(Serialize, Debug, Clone)]
pub struct NbaBacktestFeatureMapResponse {
    pub error: Option<String>,
    pub team_feature_map: Option<Vec<FeatureMaps>>,
    pub player_feature_map: Option<Vec<FeatureMaps>>
}