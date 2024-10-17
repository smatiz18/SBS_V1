use crate::models::app_state::AppState;
use crate::models::services::{get_backtest_feature_map_request::BacktestFeatureMapRequest, get_backtest_feature_map_response::BacktestFeatureMapResponse};

pub async fn get_nba_backtest_feature_map(
    app_state: AppState,
    req: BacktestFeatureMapRequest
) -> BacktestFeatureMapResponse {
    let nba_games_historical_mongo_coll = app_state.nba_games_historical_collection;
    let nba_games_odds_historical_mongo_coll = app_state.nba_odds_historical_collection;
    let nba_games_player_games_stats_avgs_historical_coll = app_state.nba_player_game_stats_avgs_historical_collection;
    let nba_game_stats_avgs_historical_collection = app_state.nba_game_stats_avgs_historical_collection;

    //use mongoDaos to aggregate data and return feature map
    let mut response = BacktestFeatureMapResponse { test_field: String::from("hello") };
    return response;
}