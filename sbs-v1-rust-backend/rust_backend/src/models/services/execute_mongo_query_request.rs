use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ExecuteMongoQueryRequest {
    pub aggregation_pipeline: Vec<String>,
    pub collection_name: String,
}