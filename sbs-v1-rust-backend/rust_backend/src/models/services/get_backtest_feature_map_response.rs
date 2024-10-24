use serde::Serialize;

use crate::models::enums::feature_maps::FeatureMaps;

#[derive(Serialize, Debug, Clone)]
pub struct BacktestFeatureMapResponse {
    pub error: Option<String>,
    
    #[serde(rename = "teamFeatureMap")]
    pub team_feature_map: Option<FeatureMaps>,
    
    #[serde(rename = "playerFeatureMap")]
    pub player_feature_map: Option<FeatureMaps>
}