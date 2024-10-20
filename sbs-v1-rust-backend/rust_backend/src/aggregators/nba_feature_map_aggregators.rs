use bson::Document;
use mongodb::Collection;

use crate::db::nba_games_avgs_historical_mongo_dao::{self, get_nba_games_avgs_by_team_and_season};
use crate::db::nba_games_historical_mongo_dao::get_nba_games_by_team_and_season;
use crate::db::nba_player_game_stats_avgs_historical_mongo_dao::get_nba_player_stats_avgs_by_id_and_season;
use crate::models::app_state::AppState;
use crate::models::enums::bet_types::BetTypes;
use crate::models::services::get_backtest_feature_map_request::BacktestFeatureMapRequest;
use crate::models::services::get_nba_backtest_feature_map_response::NbaBacktestFeatureMapResponse;

pub async fn get_nba_backtest_feature_map(
    app_state: AppState,
    req: BacktestFeatureMapRequest
) -> NbaBacktestFeatureMapResponse {
    let nba_games_historical_mongo_coll = app_state.nba_games_historical_collection;
    let nba_games_odds_historical_mongo_coll = app_state.nba_odds_historical_collection;
    let nba_player_games_stats_avgs_historical_coll = app_state.nba_player_game_stats_avgs_historical_collection;
    let nba_game_stats_avgs_historical_collection = app_state.nba_game_stats_avgs_historical_collection;

    //use mongoDaos to aggregate data and return feature map
    let mut response = NbaBacktestFeatureMapResponse { 
        error: Some(String::from("hello")), 
        team_feature_map: None, 
        player_feature_map: None 
    };

    match &req.bet_type {
        BetTypes::TeamBetTypes(_t) => 
            get_feature_map_for_team_bet_type(
                req, 
                nba_games_historical_mongo_coll, 
                nba_game_stats_avgs_historical_collection
            ).await,
        BetTypes::PlayerBetTypes(_p) => 
            get_feature_map_for_player_bet_type(
                req, 
                nba_player_games_stats_avgs_historical_coll
            ).await
    };
    
    return response;
}

pub async fn get_feature_map_for_team_bet_type(
    req: BacktestFeatureMapRequest, 
    nba_games_historical_mongo_coll: Collection<Document>,
    nba_games_avgs_historical_mongo_coll: Collection<Document> 
) {
    let mut nba_games_hist_res = get_nba_games_by_team_and_season(
        &nba_games_historical_mongo_coll, 
        req.team_id, 
        req.season
    ).await;

    let mut nba_games_avgs_hist_res = get_nba_games_avgs_by_team_and_season(
        &nba_games_avgs_historical_mongo_coll, 
        req.team_id, 
        req.season
    ).await;

    let mut sorted_game_hist = nba_games_hist_res.unwrap()
        .sort_by(|a, b| a.date_start.cmp(&b.date_start));
    
    let mut game_stats_avgs = nba_games_avgs_hist_res.unwrap()
        .get(0)
        .unwrap()
        .clone();

    let mut expanding_avg = game_stats_avgs.expanding_avg;
    let mut rolling_avg_5  = game_stats_avgs.rolling_avg_5;
    let mut rolling_avg_10 = game_stats_avgs.rolling_avg_10;


}

pub async fn get_feature_map_for_player_bet_type(req: BacktestFeatureMapRequest, coll: Collection<Document>) {
    let season: &str = &req.season.to_string(); 
    let mut nba_player_stats_avgs_res = get_nba_player_stats_avgs_by_id_and_season(
        &coll, 
        req.player_id.unwrap(), 
        season
    );
}