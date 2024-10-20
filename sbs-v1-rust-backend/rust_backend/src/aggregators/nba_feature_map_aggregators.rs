use crate::db::nba_games_historical_mongo_dao::get_nba_games_by_team_and_season;
use crate::db::nba_player_game_stats_avgs_historical_mongo_dao::get_nba_player_stats_avgs_by_id_and_season;
use crate::models::app_state::AppState;
use crate::models::enums::bet_types::BetTypes;
use crate::models::services::{get_backtest_feature_map_request::BacktestFeatureMapRequest, get_backtest_feature_map_response::BacktestFeatureMapResponse};

pub async fn get_nba_backtest_feature_map(
    app_state: AppState,
    req: BacktestFeatureMapRequest
) -> BacktestFeatureMapResponse {
    let nba_games_historical_mongo_coll = app_state.nba_games_historical_collection;
    let nba_games_odds_historical_mongo_coll = app_state.nba_odds_historical_collection;
    let nba_player_games_stats_avgs_historical_coll = app_state.nba_player_game_stats_avgs_historical_collection;
    let nba_game_stats_avgs_historical_collection = app_state.nba_game_stats_avgs_historical_collection;

    //use mongoDaos to aggregate data and return feature map
    let mut response = BacktestFeatureMapResponse { test_field: String::from("hello") };

    match req.betType {
        BetTypes::TeamBetTypes(t) => get_feature_map_for_team_bet_type(req),
        BetTypes::PlayerBetTypes(p) => get_feature_map_for_player_bet_type(req),
    };
    
    return response;
}

pub fn get_feature_map_for_team_bet_type(req: BacktestFeatureMapRequest) {
    get_nba_games_by_team_and_season(&nba_games_historical_mongo_coll.clone(), req.teamId, req.season);  
}

pub fn get_feature_map_for_player_bet_type(req: BacktestFeatureMapRequest) {
    get_nba_player_stats_avgs_by_id_and_season(&nba_player_games_stats_avgs_historical_coll.clone(), req.playerId, req.season);
}