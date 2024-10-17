use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct BacktestFeatureMapResponse {
    pub test_field: String
}