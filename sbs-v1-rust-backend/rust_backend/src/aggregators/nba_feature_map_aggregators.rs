#![allow(dead_code)]
#![allow(unused_variables)]
use std::collections::{HashMap, HashSet};

use bson::{doc, Document};
use chrono::{NaiveDate, Utc};
use mongodb::Collection;

use crate::db::nba_team_aggregated_game_stats_historical_mongo_dao::get_nba_team_agg_game_stats;
use crate::db::nba_games_historical_mongo_dao::{find as nba_games_hist_coll_find, get_nba_games_by_team_and_season};
use crate::db::nba_player_aggregated_game_stats_historical_mongo_dao::get_nba_agg_player_stats_by_id_and_season;
use crate::models::app_state::AppState;
use crate::models::db::nba_team_agg_game_stats_historical::GameStats;
use crate::models::db::nba_game_team_stats_historical::PlayerStatsObj;
use crate::models::enums::feature_maps::FeatureMaps;
use crate::models::services::get_backtest_feature_map_request::BacktestFeatureMapRequest;
use crate::models::services::get_backtest_feature_map_response::BacktestFeatureMapResponse;

/** driver **********************************************************************/
/********************************************************************************/
pub async fn get_nba_backtest_feature_map(
    app_state: AppState,
    req: BacktestFeatureMapRequest
) -> BacktestFeatureMapResponse {
    let nba_games_historical_mongo_coll = app_state.nba_games_historical_collection;
    let _nba_games_odds_historical_mongo_coll = app_state.nba_odds_historical_collection;
    let nba_player_games_stats_avgs_historical_coll = app_state.nba_player_aggregated_game_stats_historical_collection;
    let nba_team_aggregated_game_stats_historical_collection = app_state.nba_team_aggregated_game_stats_historical_collection;

    let feature_map_res = if req.team_bet_type.is_some() {
        let feature_map = get_feature_map_for_team_bet_type(
            req, 
            nba_games_historical_mongo_coll, 
            nba_team_aggregated_game_stats_historical_collection
        ).await;

        BacktestFeatureMapResponse {
            error: None,
            team_feature_map: Some(feature_map),
            player_feature_map: None
        }
        } else {
            let feature_map = get_feature_map_for_player_bet_type(
                req, 
                nba_player_games_stats_avgs_historical_coll,
                nba_games_historical_mongo_coll
            ).await;

            BacktestFeatureMapResponse {
                error: None,
                team_feature_map: None,
                player_feature_map: Some(feature_map)
            }
        };
    
    return feature_map_res;
}
/********************************************************************************/

/** team feature maps ***********************************************************/
/********************************************************************************/
pub async fn get_feature_map_for_team_bet_type(
    req: BacktestFeatureMapRequest, 
    nba_games_historical_mongo_coll: Collection<Document>,
    nba_team_agg_game_stats_mongo_coll: Collection<Document> 
) -> FeatureMaps {
    let mut nba_games_hist_res = get_nba_games_by_team_and_season(
        &nba_games_historical_mongo_coll, 
        req.team_id, 
        req.season
    )
    .await
    .unwrap();

    nba_games_hist_res.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    let nba_games_avgs_hist_res = get_nba_team_agg_game_stats(
        &nba_team_agg_game_stats_mongo_coll, 
        Some(vec!(req.team_id)), 
        Some(req.season),
        Some(req.season_type)
    )
    .await
    .unwrap();

    let game_stats_avgs = nba_games_avgs_hist_res.get(0)
        .unwrap()
        .clone();

    let mut game_stats: Vec<GameStats> = game_stats_avgs.game_stats
        .values()
        .cloned()
        .collect();

    game_stats.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    // let mut expanding_avg: Vec<GameStats> = game_stats_avgs.expanding_avg
    //     .values()
    //     .cloned()
    //     .collect();

    // expanding_avg.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    // let mut rolling_avg_5: Vec<GameStats> = game_stats_avgs.rolling_avg_5
    //     .values()
    //     .cloned()
    //     .collect();

    // rolling_avg_5.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    // let mut rolling_avg_10: Vec<GameStats> = game_stats_avgs.rolling_avg_10
    //     .values()
    //     .cloned()
    //     .collect();

    // rolling_avg_10.sort_by(|a, b| a.date_start.cmp(&b.date_start));


    let game_ids: HashSet<i32> = HashSet::from_iter(
        game_stats.clone().into_iter()
            .map(|g| g.game_id as i32)
    );
    let filtered_games = nba_games_hist_res.into_iter().filter(|g| game_ids.contains(&(g.id as i32)));
    
    // let teams_feature_map: Vec<NbaBacktestTeamFeatures> = filtered_games
    //     .zip(game_stats.iter())
    //     .zip(expanding_avg.iter())
    //     .zip(rolling_avg_5.iter())
    //     .zip(rolling_avg_10.iter())
    //     .flat_map(|((((game_hist, orig_stats), exp), roll_5), roll_10)| {

    //         let win = match req.team_id {
    //             id if id == game_hist.teams_home_id => game_hist.scores_home_points > game_hist.scores_visitors_points,
    //             _ => game_hist.scores_visitors_points > game_hist.scores_home_points 
    //         };

    //         if
    //             game_hist.id as u32 == orig_stats.game_id && 
    //             game_hist.id as u32 == exp.game_id &&
    //             game_hist.id as u32 == roll_5.game_id && 
    //             game_hist.id as u32 == roll_10.game_id
    //         {
    //             return Some(
    //                 NbaBacktestTeamFeatures {
    //                     win: win as i32,
    //                     predictor_team_id: req.team_id,
    //                     teams_visitors_id: game_hist.teams_visitors_id,
    //                     teams_home_id: game_hist.teams_home_id,
    //                     date_start: game_hist.date_start,
    //                     linescore_q1: orig_stats.linescore_q1,
    //                     linescore_q2: orig_stats.linescore_q2,
    //                     linescore_q3: orig_stats.linescore_q3,
    //                     linescore_q4: orig_stats.linescore_q4,
    //                     expanding_avg_linescore_q1: exp.linescore_q1,
    //                     expanding_avg_linescore_q2: exp.linescore_q2,
    //                     expanding_avg_linescore_q3: exp.linescore_q3,
    //                     expanding_avg_linescore_q4: exp.linescore_q4,
    //                     rolling_avg_5_linescore_q1: roll_5.linescore_q1,
    //                     rolling_avg_5_linescore_q2: roll_5.linescore_q2,
    //                     rolling_avg_5_linescore_q3: roll_5.linescore_q3,
    //                     rolling_avg_5_linescore_q4: roll_5.linescore_q4,
    //                     rolling_avg_10_linescore_q1: roll_10.linescore_q1,
    //                     rolling_avg_10_linescore_q2: roll_10.linescore_q2,
    //                     rolling_avg_10_linescore_q3: roll_10.linescore_q3,
    //                     rolling_avg_10_linescore_q4: roll_10.linescore_q4,
    //                 }
    //             );
                
    //         } else {
    //             return None;
    //         }
    //     }).collect();

        return FeatureMaps::NbaBacktestTeamFeatureMap(vec!());
}
/********************************************************************************/

/** player feature maps *********************************************************/
/********************************************************************************/
pub async fn get_feature_map_for_player_bet_type(
    req: BacktestFeatureMapRequest, 
    nba_player_games_stats_avgs_historical_coll: Collection<Document>,
    nba_games_historical_mongo_coll: Collection<Document>
) -> FeatureMaps {
    let nba_player_stats_avgs_res = get_nba_agg_player_stats_by_id_and_season(
        &nba_player_games_stats_avgs_historical_coll, 
        req.player_id.unwrap(), 
        &req.season.to_string(),
        Some(req.season_type)
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

    // let mut expanding_avg: Vec<&PlayerStatsObj> = nba_player_stats_avgs_res.expanding_avg
    //     .values()
    //     .into_iter()
    //     .collect();
    // expanding_avg.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    // let mut rolling_avg_5: Vec<&PlayerStatsObj> = nba_player_stats_avgs_res.rolling_avg_5
    //     .values()
    //     .into_iter()
    //     .collect();
    // rolling_avg_5.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    // let mut rolling_avg_10: Vec<&PlayerStatsObj> = nba_player_stats_avgs_res.rolling_avg_10
    //     .values()
    //     .into_iter()
    //     .collect();
    // rolling_avg_10.sort_by(|a, b| a.date_start.cmp(&b.date_start));

    struct HomeVsVisitorTeamIds {
        team_home_id: f64,
        team_visitor_id: f64
    }

    let game_ids_to_team_ids_map: HashMap<String, HomeVsVisitorTeamIds> = nba_games_hist_coll_find(
        &nba_games_historical_mongo_coll, 
        doc! {"season": req.season }, 
        None
    )
    .await
    .unwrap()
    .into_iter()
    .map(|game_obj| {
        let team_ids = HomeVsVisitorTeamIds {
            team_home_id: game_obj.teams_home_id,
            team_visitor_id: game_obj.teams_visitors_id
        };
        (game_obj.id.to_string(), team_ids)
    })
    .collect();

    // let res = player_stats.iter()
    //     .zip(expanding_avg.iter())
    //     .zip(rolling_avg_5.iter())
    //     .zip(rolling_avg_10.iter())
    //     .flat_map(|(((player_stats, exp), roll_5), roll_10)| {

    //         let team_ids_obj = game_ids_to_team_ids_map.get(&player_stats.game_id.to_string()).unwrap();
    //         let opponent_id = if team_ids_obj.team_home_id == nba_player_stats_avgs_res.team_id {
    //             team_ids_obj.team_visitor_id
    //         } else {
    //             team_ids_obj.team_home_id
    //         };
        
    //         if 
    //             player_stats.game_id == exp.game_id && 
    //             player_stats.game_id == roll_5.game_id && 
    //             player_stats.game_id == roll_10.game_id 
    //         {
    //             Some(
    //                 NbaBacktestPlayerFeatures {
    //                     date_start: player_stats.date_start,
    //                     team_id: nba_player_stats_avgs_res.team_id,
    //                     opponent_team_id: opponent_id,
    //                     age: calculate_age(nba_player_stats_avgs_res.birthday.clone()),
                        
    //                     points: player_stats.points.unwrap(),
    //                     min: player_stats.min.unwrap(),
    //                     fgm: player_stats.fgm.unwrap(),
    //                     fga: player_stats.fga.unwrap(),
    //                     fgp: player_stats.fgp.unwrap(),
    //                     ftm: player_stats.ftm.unwrap(),
    //                     fta: player_stats.fta.unwrap(),
    //                     ftp: player_stats.ftp.unwrap(),
    //                     tpm: player_stats.tpm.unwrap(),
    //                     tpa: player_stats.tpa.unwrap(),
    //                     tpp: player_stats.tpp.unwrap(),
    //                     off_reb: player_stats.off_reb.unwrap(),
    //                     def_reb: player_stats.def_reb.unwrap(),
    //                     tot_reb: player_stats.tot_reb.unwrap(),
    //                     assists: player_stats.assists.unwrap(),
    //                     p_fouls: player_stats.p_fouls.unwrap(),
    //                     steals: player_stats.steals.unwrap(),
    //                     turnovers: player_stats.turnovers.unwrap(),
    //                     blocks: player_stats.blocks.unwrap(),
    //                     plus_minus: player_stats.plus_minus.unwrap(),
    
    //                     expanding_avg_points: exp.points.unwrap(),
    //                     expanding_avg_min: exp.min.unwrap(),
    //                     expanding_avg_fgm: exp.fgm.unwrap(),
    //                     expanding_avg_fga: exp.fga.unwrap(),
    //                     expanding_avg_fgp: exp.fgp.unwrap(),
    //                     expanding_avg_ftm: exp.ftm.unwrap(),
    //                     expanding_avg_fta: exp.fta.unwrap(),
    //                     expanding_avg_ftp: exp.ftp.unwrap(),
    //                     expanding_avg_tpm: exp.tpm.unwrap(),
    //                     expanding_avg_tpa: exp.tpa.unwrap(),
    //                     expanding_avg_tpp: exp.tpp.unwrap(),
    //                     expanding_avg_off_reb: exp.off_reb.unwrap(),
    //                     expanding_avg_def_reb: exp.def_reb.unwrap(),
    //                     expanding_avg_tot_reb: exp.tot_reb.unwrap(),
    //                     expanding_avg_assists: exp.assists.unwrap(),
    //                     expanding_avg_p_fouls: exp.p_fouls.unwrap(),
    //                     expanding_avg_steals: exp.steals.unwrap(),
    //                     expanding_avg_turnovers: exp.turnovers.unwrap(),
    //                     expanding_avg_blocks: exp.blocks.unwrap(),
    //                     expanding_avg_plus_minus: exp.plus_minus.unwrap(),
    
    //                     rolling_avg_5_points: roll_5.points.unwrap(),
    //                     rolling_avg_5_min: roll_5.min.unwrap(),
    //                     rolling_avg_5_fgm: roll_5.fgm.unwrap(),
    //                     rolling_avg_5_fga: roll_5.fga.unwrap(),
    //                     rolling_avg_5_fgp: roll_5.fgp.unwrap(),
    //                     rolling_avg_5_ftm: roll_5.ftm.unwrap(),
    //                     rolling_avg_5_fta: roll_5.fta.unwrap(),
    //                     rolling_avg_5_ftp: roll_5.ftp.unwrap(),
    //                     rolling_avg_5_tpm: roll_5.tpm.unwrap(),
    //                     rolling_avg_5_tpa: roll_5.tpa.unwrap(),
    //                     rolling_avg_5_tpp: roll_5.tpp.unwrap(),
    //                     rolling_avg_5_off_reb: roll_5.off_reb.unwrap(),
    //                     rolling_avg_5_def_reb: roll_5.def_reb.unwrap(),
    //                     rolling_avg_5_tot_reb: roll_5.tot_reb.unwrap(),
    //                     rolling_avg_5_assists: roll_5.assists.unwrap(),
    //                     rolling_avg_5_p_fouls: roll_5.p_fouls.unwrap(),
    //                     rolling_avg_5_steals: roll_5.steals.unwrap(),
    //                     rolling_avg_5_turnovers: roll_5.turnovers.unwrap(),
    //                     rolling_avg_5_blocks: roll_5.blocks.unwrap(),
    //                     rolling_avg_5_plus_minus: roll_5.plus_minus.unwrap(),
    
    //                     rolling_avg_10_points: roll_10.points.unwrap(),
    //                     rolling_avg_10_min: roll_10.min.unwrap(),
    //                     rolling_avg_10_fgm: roll_10.fgm.unwrap(),
    //                     rolling_avg_10_fga: roll_10.fga.unwrap(),
    //                     rolling_avg_10_fgp: roll_10.fgp.unwrap(),
    //                     rolling_avg_10_ftm: roll_10.ftm.unwrap(),
    //                     rolling_avg_10_fta: roll_10.fta.unwrap(),
    //                     rolling_avg_10_ftp: roll_10.ftp.unwrap(),
    //                     rolling_avg_10_tpm: roll_10.tpm.unwrap(),
    //                     rolling_avg_10_tpa: roll_10.tpa.unwrap(),
    //                     rolling_avg_10_tpp: roll_10.tpp.unwrap(),
    //                     rolling_avg_10_off_reb: roll_10.off_reb.unwrap(),
    //                     rolling_avg_10_def_reb: roll_10.def_reb.unwrap(),
    //                     rolling_avg_10_tot_reb: roll_10.tot_reb.unwrap(),
    //                     rolling_avg_10_assists: roll_10.assists.unwrap(),
    //                     rolling_avg_10_p_fouls: roll_10.p_fouls.unwrap(),
    //                     rolling_avg_10_steals: roll_10.steals.unwrap(),
    //                     rolling_avg_10_turnovers: roll_10.turnovers.unwrap(),
    //                     rolling_avg_10_blocks: roll_10.blocks.unwrap(),
    //                     rolling_avg_10_plus_minus: roll_10.plus_minus.unwrap(),
    //                 }
    //             )
    //         } else {
    //             None
    //         }
    //     }).collect();
        return FeatureMaps::NbaBacktestPlayerFeatureMap(vec!());
}
/********************************************************************************/

/** player feature maps *********************************************************/
/********************************************************************************/
pub fn calculate_age(birthday: Option<String>) -> f64 {
    if let Some(birthday_str) = birthday {
        if let Ok(birth_date) = NaiveDate::parse_from_str(&birthday_str, "%Y-%m-%d") {
            return Utc::now().date_naive().years_since(birth_date).unwrap() as f64;
        }
    }
    26.3
}
/********************************************************************************/