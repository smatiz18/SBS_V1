pub const NBA_MONGO_LOADER_FILE: &str = "nba_mongo_loaders.py";
pub const SBS_V1_PYTHON_BACKEND_MODULE: &str = "sbs-v1-python-backend";
pub const NBA_GAME_DATA_LOADER_RUNNER_FUNCTION: &str  = "run_nba_daily_games_data_loader";
pub const NBA_PLAYER_DATA_LOADER_RUNNER_FUNCTION: &str = "run_nba_daily_player_data_loader";

pub fn get_nba_mongo_loader_path() -> String {
    format!("../../{}/app/scripts/{}", SBS_V1_PYTHON_BACKEND_MODULE, NBA_MONGO_LOADER_FILE)
}