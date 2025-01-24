use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct GitHubApiAuthRequest {
    pub client_id: String,
    pub client_secret: String,
    pub code: String,
    pub redirect_uri: String,
}