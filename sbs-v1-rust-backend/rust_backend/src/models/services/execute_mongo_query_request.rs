use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ExecuteMongoQueryRequest {
    pub aggregation_pipeline: Vec<MongoAggregation>,
    pub collection_name: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct MongoAggregation {
    pub aggregation_type: String,
    pub body: String
}