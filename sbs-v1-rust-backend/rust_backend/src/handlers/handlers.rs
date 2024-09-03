use actix_web::{ web, HttpResponse, Responder};
use crate::models::services::get_nba_games_req_by_team_and_season::GetNbaGamesReqByTeamAndSeason;
use crate::models::services::get_nba_odds_req_by_team_and_season::GetNbaOddsReqByTeamAndSeason;
use crate::models::services::get_nba_players_by_team_and_season::GetNbaPlayersByTeamAndSeason;
use crate::models::services::get_nba_players_by_team_and_season_response::GetNbaPlayersByTeamAndSeasonResponse;
use crate::routes::endpoints::{NBA_RAPID_API_ROOT, NBA_RAPID_API_HOST};
use reqwest::header::{HeaderMap, HeaderValue};
use std::env;
use log::{info, error};

use crate::models::app_state::AppState;
use crate::db::{nba_games_historical_mongo_dao, nba_odds_historical_mongo_dao};

pub async fn get_nba_games_by_team_and_season(
    app_state: web::Data<AppState>, 
    req: web::Query<GetNbaGamesReqByTeamAndSeason>
) -> impl Responder {
    info!("Recieved req for nba_historical_game_req team: {}, season: {}", req.teamNickname, req.season);
    let objs_result = nba_games_historical_mongo_dao::get_nba_games_by_team_and_season(
        &app_state.as_ref().nba_games_historical_collection, 
        &req.teamNickname, 
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
    req: web::Query<GetNbaOddsReqByTeamAndSeason>
) -> impl Responder {
    info!("Recieved req for nba_historical_odds_req team: {}, season: {}", req.teamName, req.season);
    let objs_result = nba_odds_historical_mongo_dao::get_nba_odds_by_team_and_season(
        &app_state.as_ref().nba_odds_historical_collection, 
        &req.teamName,
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

pub async fn get_nba_players_by_team_and_season(
    app_state: web::Data<AppState>,
    req: web::Query<GetNbaPlayersByTeamAndSeason> 
) -> impl Responder {
    info!("Recieved req for get_nba_players_by_team_and_season, teamId {}, season: {}", req.teamId, req.season);
    let client = reqwest::Client::new();
    let url = format!("{}/players?team={}&season={}", NBA_RAPID_API_ROOT, &req.teamId, &req.season); 
    let rapid_api_key = env::var("RAPID_API_KEY").expect("You must set RAPID_API_KEY environment var!");
    let mut headers = HeaderMap::new();
    headers.insert("x-rapidapi-host", HeaderValue::from_static(NBA_RAPID_API_HOST));
    headers.insert("x-rapidapi-key", HeaderValue::from_str(&rapid_api_key).expect("You must set RAPID_API_KEY environment var!"));

    match client
        .get(url)
        .headers(headers)
        .send()
        .await {
            Ok(response) => {
                match response.json::<GetNbaPlayersByTeamAndSeasonResponse>().await {
                    Ok(resp_obj) => {
                        info!("Returned resp from {}", url);
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

pub async fn test() -> HttpResponse {
    HttpResponse::Ok().body("Test!")
}