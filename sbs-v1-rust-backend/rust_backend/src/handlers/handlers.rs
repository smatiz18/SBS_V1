use actix_web::{ web, HttpResponse, Responder};
use crate::models::services::get_backtest_feature_map_request::BacktestFeatureMapRequest;
use crate::models::services::get_nba_games_by_team_and_season_request::GetNbaGamesByTeamAndSeasonRequest;
use crate::models::services::get_nba_odds_by_team_and_season_request::GetNbaOddsByTeamAndSeasonRequest;
use crate::models::services::get_nba_players_by_team_and_season_request::GetNbaPlayersByTeamAndSeasonRequest;
use crate::models::services::get_nba_players_by_team_and_season_response::GetNbaPlayersByTeamAndSeasonResponse;
use crate::models::services::get_nba_player_stats_by_id_and_season_request::GetNbaPlayerStatsByIdAndSeasonRequest;
use crate::routes::endpoints::{NBA_RAPID_API_ROOT, NBA_RAPID_API_HOST};
use reqwest::header::{HeaderMap, HeaderValue};
use std::env;
use log::{info, error};

use crate::models::app_state::AppState;
use crate::db::{nba_games_historical_mongo_dao, nba_odds_historical_mongo_dao, nba_player_game_stats_avgs_historical_mongo_dao};

/******************************** MONGO HANDLERS ********************************/
/********************************************************************************/
pub async fn get_nba_games_by_team_and_season(
    app_state: web::Data<AppState>, 
    req: web::Query<GetNbaGamesByTeamAndSeasonRequest>
) -> impl Responder {
    info!("Recieved req for nba_historical_game_req teamId: {}, season: {}", req.team_id, req.season);
    let objs_result = nba_games_historical_mongo_dao::get_nba_games_by_team_and_season(
        &app_state.as_ref().nba_games_historical_collection, 
        req.team_id, 
        req.season
    ).await; 

    match objs_result {
        Ok(objs) => {
            info!("Returned {} docs from mongo", objs.len());
            HttpResponse::Ok().json(objs)
        },
        Err(e) => {
            error!("Failed to get nba games by teams and season: {:?}", e);
            HttpResponse::InternalServerError().body(format!("{:?}", e))
        }
    }
}

pub async fn get_nba_odds_by_team_and_season(
    app_state: web::Data<AppState>, 
    req: web::Query<GetNbaOddsByTeamAndSeasonRequest>
) -> impl Responder {
    info!("Recieved req for nba_historical_odds_req team: {}, season: {}", req.team_name, req.season);
    let objs_result = nba_odds_historical_mongo_dao::get_nba_odds_by_team_and_season(
        &app_state.as_ref().nba_odds_historical_collection, 
        &req.team_name,
        req.season
    ).await; 

    match objs_result {
        Ok(objs) => {
            info!("Returned {} docs from mongo", objs.len());
            HttpResponse::Ok().json(objs)
        },
        Err(e) => {
            error!("Failed to get nba odds by teams and season: {:?}", e);
            HttpResponse::InternalServerError().body(format!("{:?}", e))
        }
    }
}

pub async fn get_nba_player_stats_by_id_and_season(
    app_state: web::Data<AppState>, 
    req: web::Query<GetNbaPlayerStatsByIdAndSeasonRequest>
) -> impl Responder {
    info!("Recieved req for get_nba_player_stats_by_id_and_season id: {}, season: {}", req.player_id, req.season);
    let objs_result = nba_player_game_stats_avgs_historical_mongo_dao::get_nba_player_stats_avgs_by_id_and_season(
        &app_state.as_ref().nba_player_game_stats_avgs_historical_collection, 
        req.player_id,
        &req.season
    ).await; 

    match objs_result {
        Ok(objs) => {
            info!("Returned {} docs from mongo", objs.len());
            HttpResponse::Ok().json(objs)
        },
        Err(e) => {
            error!("Failed to get nba odds by teams and season: {:?}", e);
            HttpResponse::InternalServerError().body(format!("{:?}", e))
        }
    }
}

pub async fn get_feature_map_for_backtest(
    _app_state: web::Data<AppState>, 
    req: web::Query<BacktestFeatureMapRequest>
) -> impl Responder {
    info!("Recieved req for get_nba_player_stats_by_id_and_season id: {:?}, season: {}", req.player_id, req.season);
    return HttpResponse::Ok().body("Implement handler!");
}
/********************************************************************************/

/******************************* WEB API HANDLERS *******************************/
/********************************************************************************/
pub async fn get_nba_players_by_team_and_season(
    _app_state: web::Data<AppState>,
    req: web::Query<GetNbaPlayersByTeamAndSeasonRequest> 
) -> impl Responder {
    info!("Recieved req for get_nba_players_by_team_and_season, teamId {}, season: {}", req.team_id, req.season);
    let client = reqwest::Client::new();
    let url = format!("{}/players?team={}&season={}", NBA_RAPID_API_ROOT, &req.team_id, &req.season); 
    let rapid_api_key = env::var("RAPID_API_KEY").expect("You must set RAPID_API_KEY environment var!");
    let mut headers = HeaderMap::new();
    headers.insert("x-rapidapi-host", HeaderValue::from_static(NBA_RAPID_API_HOST));
    headers.insert("x-rapidapi-key", HeaderValue::from_str(&rapid_api_key).expect("You must set RAPID_API_KEY environment var!"));

    match client
        .get(url.clone())
        .headers(headers)
        .send()
        .await {
            Ok(response) => {
                match response.json::<GetNbaPlayersByTeamAndSeasonResponse>().await {
                    Ok(resp_obj) => {
                        info!("Returned resp from {}", url.clone());
                        HttpResponse::Ok().json(resp_obj)
                    },
                    Err(e) => {
                        error!("Failed to parse response: {:?}", e);
                        HttpResponse::InternalServerError().body(format!("{:?}", e))
                    },
                }
            },
            Err(e) => {
                error!("Failed to fetch data: {:?}", e);
                HttpResponse::InternalServerError().body("Failed to fetch data")
            },
        }
}
/********************************************************************************/

pub async fn test() -> HttpResponse {
    HttpResponse::Ok().body("Test!")
}