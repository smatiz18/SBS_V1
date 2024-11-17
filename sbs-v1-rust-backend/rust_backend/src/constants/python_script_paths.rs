pub const NBA_MONGO_LOADER_FILE: &str = "nba_mongo_loaders.py";
pub const SBS_V1_PYTHON_BACKEND_MODULE: &str = "sbs-v1-python-backend";

pub fn get_nba_mongo_loader_path() -> String {
    format!("../../{}/app/scripts/{}", SBS_V1_PYTHON_BACKEND_MODULE, NBA_MONGO_LOADER_FILE)
}