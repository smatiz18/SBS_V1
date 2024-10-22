use bson::Document;
use mongodb::Collection;

use crate::db::nba_games_avgs_historical_mongo_dao::{self, get_nba_games_avgs_by_team_and_season};
use crate::db::nba_games_historical_mongo_dao::get_nba_games_by_team_and_season;
use crate::db::nba_player_game_stats_avgs_historical_mongo_dao::get_nba_player_stats_avgs_by_id_and_season;
use crate::models::app_state::AppState;
use crate::models::db::nba_games_avgs_historical::GameStats;
use crate::models::db::nba_player_game_stats_historical::PlayerStatsObj;
use crate::models::enums::bet_types::BetTypes;
use crate::models::enums::feature_maps::FeatureMaps;
use crate::models::nba_backtest_player_features::NbaBacktestPlayerFeatures;
use crate::models::nba_backtest_team_features::NbaBacktestTeamFeatures;
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

    let feature_map = match &req.bet_type {
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
) -> FeatureMaps {
    let mut nba_games_hist_res = get_nba_games_by_team_and_season(
        &nba_games_historical_mongo_coll, 
        req.team_id, 
        req.season
    )
    .await
    .unwrap();

    let mut nba_games_avgs_hist_res = get_nba_games_avgs_by_team_and_season(
        &nba_games_avgs_historical_mongo_coll, 
        req.team_id, 
        req.season
    )
    .await
    .unwrap();

    nba_games_hist_res.sort_by(|a, b| a.date_start.cmp(&b.date_start));
    
    let game_stats_avgs = nba_games_avgs_hist_res.get(0)
        .unwrap()
        .clone();

    let mut game_stats: Vec<GameStats> = game_stats_avgs.game_stats
        .values()
        .cloned()
        .collect();

        game_stats.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    let mut expanding_avg: Vec<GameStats> = game_stats_avgs.expanding_avg
        .values()
        .cloned()
        .collect();

    expanding_avg.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    let mut rolling_avg_5: Vec<GameStats> = game_stats_avgs.rolling_avg_5
        .values()
        .cloned()
        .collect();

    rolling_avg_5.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    let mut rolling_avg_10: Vec<GameStats> = game_stats_avgs.rolling_avg_10
        .values()
        .cloned()
        .collect();

    rolling_avg_10.sort_by(|a, b| a.date_start.cmp(&b.date_start));


    let teams_feature_map: Vec<NbaBacktestTeamFeatures> = nba_games_hist_res.iter()
        .zip(game_stats.iter())
        .zip(expanding_avg.iter())
        .zip(rolling_avg_5.iter())
        .zip(rolling_avg_10.iter())
        .flat_map(|((((game_hist, orig_stats), exp), roll_5), roll_10)| {

            let win = match req.team_id {
                id if id == game_hist.teams_home_id => game_hist.scores_home_points > game_hist.scores_visitors_points,
                _ => game_hist.scores_visitors_points > game_hist.scores_home_points 
            };

            if
                game_hist.id as u32 == orig_stats.game_id && 
                game_hist.id as u32 == exp.game_id &&
                game_hist.id as u32 == roll_5.game_id && 
                game_hist.id as u32 == roll_10.game_id
            {
                return Some(
                    NbaBacktestTeamFeatures {
                        win: win as i32,
                        predictor_team_id: req.team_id,
                        teams_visitors_id: game_hist.teams_visitors_id,
                        teams_home_id: game_hist.teams_home_id,
                        date_start: game_hist.date_start,
                        linescore_q1: orig_stats.linescore_q1,
                        linescore_q2: orig_stats.linescore_q2,
                        linescore_q3: orig_stats.linescore_q3,
                        linescore_q4: orig_stats.linescore_q4,
                        expanding_avg_linescore_q1: exp.linescore_q1,
                        expanding_avg_linescore_q2: exp.linescore_q2,
                        expanding_avg_linescore_q3: exp.linescore_q3,
                        expanding_avg_linescore_q4: exp.linescore_q4,
                        rolling_avg_5_linescore_q1: roll_5.linescore_q1,
                        rolling_avg_5_linescore_q2: roll_5.linescore_q2,
                        rolling_avg_5_linescore_q3: roll_5.linescore_q3,
                        rolling_avg_5_linescore_q4: roll_5.linescore_q4,
                        rolling_avg_10_linescore_q1: roll_10.linescore_q1,
                        rolling_avg_10_linescore_q2: roll_10.linescore_q2,
                        rolling_avg_10_linescore_q3: roll_10.linescore_q3,
                        rolling_avg_10_linescore_q4: roll_10.linescore_q4,
                    }
                );
                
            } else {
                return None;
            }
        }).collect();

        return FeatureMaps::NbaBacktestTeamFeatureMap(teams_feature_map);
}

pub async fn get_feature_map_for_player_bet_type(req: BacktestFeatureMapRequest, coll: Collection<Document>) -> FeatureMaps {
    let season: &str = &req.season.to_string(); 
    let nba_player_stats_avgs_res = get_nba_player_stats_avgs_by_id_and_season(
        &coll, 
        req.player_id.unwrap(), 
        season
    )
    .await
    .unwrap()
    .get(0)
    .unwrap()
    .clone();

    let mut player_stats: Vec<&PlayerStatsObj> = nba_player_stats_avgs_res.player_stats
        .values()
        .into_iter()
        .collect();
    player_stats.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    let mut expanding_avg: Vec<&PlayerStatsObj> = nba_player_stats_avgs_res.expanding_avg
        .values()
        .into_iter()
        .collect();
    expanding_avg.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    let mut rolling_avg_5: Vec<&PlayerStatsObj> = nba_player_stats_avgs_res.rolling_avg_5
        .values()
        .into_iter()
        .collect();
    rolling_avg_5.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    let mut rolling_avg_10: Vec<&PlayerStatsObj> = nba_player_stats_avgs_res.rolling_avg_10
        .values()
        .into_iter()
        .collect();
    rolling_avg_10.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    let res = player_stats.iter()
        .zip(expanding_avg.iter())
        .zip(rolling_avg_5.iter())
        .zip(rolling_avg_10.iter())
        .flat_map(|(((player_stats, exp), roll_5), roll_10)| {
            Some(
                NbaBacktestPlayerFeatures {
                    date_start: player_stats.date_start,
                    team_id: player_stats.team_id,
                    opponent_team_id: todo!(),
                    age: todo!(),
                    points: todo!(),
                    pos: todo!(),
                    min: todo!(),
                    fgm: todo!(),
                    fga: todo!(),
                    fgp: todo!(),
                    ftm: todo!(),
                    fta: todo!(),
                    ftp: todo!(),
                    tpm: todo!(),
                    tpa: todo!(),
                    tpp: todo!(),
                    off_reb: todo!(),
                    def_reb: todo!(),
                    tot_reb: todo!(),
                    assists: todo!(),
                    p_fouls: todo!(),
                    steals: todo!(),
                    turnovers: todo!(),
                    blocks: todo!(),
                    plus_minus: todo!(),
                    expanding_avg_points: todo!(),
                    expanding_avg_min: todo!(),
                    expanding_avg_fgm: todo!(),
                    expanding_avg_fga: todo!(),
                    expanding_avg_fgp: todo!(),
                    expanding_avg_ftm: todo!(),
                    expanding_avg_fta: todo!(),
                    expanding_avg_ftp: todo!(),
                    expanding_avg_tpm: todo!(),
                    expanding_avg_tpa: todo!(),
                    expanding_avg_tpp: todo!(),
                    expanding_avg_off_reb: todo!(),
                    expanding_avg_def_reb: todo!(),
                    expanding_avg_tot_reb: todo!(),
                    expanding_avg_assists: todo!(),
                    expanding_avg_p_fouls: todo!(),
                    expanding_avg_steals: todo!(),
                    expanding_avg_turnovers: todo!(),
                    expanding_avg_blocks: todo!(),
                    expanding_avg_plus_minus: todo!(),
                    rolling_avg_5_points: todo!(),
                    rolling_avg_5_min: todo!(),
                    rolling_avg_5_fgm: todo!(),
                    rolling_avg_5_fga: todo!(),
                    rolling_avg_5_fgp: todo!(),
                    rolling_avg_5_ftm: todo!(),
                    rolling_avg_5_fta: todo!(),
                    rolling_avg_5_ftp: todo!(),
                    rolling_avg_5_tpm: todo!(),
                    rolling_avg_5_tpa: todo!(),
                    rolling_avg_5_tpp: todo!(),
                    rolling_avg_5_off_reb: todo!(),
                    rolling_avg_5_def_reb: todo!(),
                    rolling_avg_5_tot_reb: todo!(),
                    rolling_avg_5_assists: todo!(),
                    rolling_avg_5_p_fouls: todo!(),
                    rolling_avg_5_steals: todo!(),
                    rolling_avg_5_turnovers: todo!(),
                    rolling_avg_5_blocks: todo!(),
                    rolling_avg_5_plus_minus: todo!(),
                    rolling_avg_10_points: todo!(),
                    rolling_avg_10_min: todo!(),
                    rolling_avg_10_fgm: todo!(),
                    rolling_avg_10_fga: todo!(),
                    rolling_avg_10_fgp: todo!(),
                    rolling_avg_10_ftm: todo!(),
                    rolling_avg_10_fta: todo!(),
                    rolling_avg_10_ftp: todo!(),
                    rolling_avg_10_tpm: todo!(),
                    rolling_avg_10_tpa: todo!(),
                    rolling_avg_10_tpp: todo!(),
                    rolling_avg_10_off_reb: todo!(),
                    rolling_avg_10_def_reb: todo!(),
                    rolling_avg_10_tot_reb: todo!(),
                    rolling_avg_10_assists: todo!(),
                    rolling_avg_10_p_fouls: todo!(),
                    rolling_avg_10_steals: todo!(),
                    rolling_avg_10_turnovers: todo!(),
                    rolling_avg_10_blocks: todo!(),
                    rolling_avg_10_plus_minus: todo!(),
                }
            )
        }).collect();
        return FeatureMaps::NbaBacktestPlayerFeatureMap(res);
}