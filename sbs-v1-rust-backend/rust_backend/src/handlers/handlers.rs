use actix_web::{ web, HttpResponse, Responder};
use crate::models::services::get_nba_games_req_by_team_and_season::GetNbaGamesReqByTeamAndSeason;
use crate::models::services::get_nba_odds_req_by_team_and_season::GetNbaOddsReqByTeamAndSeason;
use crate::models::app_state::AppState;
use crate::db::{nba_games_historical_mongo_dao, nba_odds_historical_mongo_dao};

pub async fn get_nba_games_by_team_and_season(
    app_state: web::Data<AppState>, 
    req: web::Query<GetNbaGamesReqByTeamAndSeason>
) -> impl Responder {
    println!("Recieved req for nba_historical_game_req team: {}, season: {}", req.teamNickname, req.season);
    let objs_result = nba_games_historical_mongo_dao::get_nba_games_by_team_and_season(
        &app_state.as_ref().nba_games_historical_collection, 
        &req.teamNickname, 
        req.season
    ).await; 

    match objs_result {
        Ok(objs) => {
            println!("Returned {} docs from mongo", objs.len());
            HttpResponse::Ok().json(objs)
        },
        Err(e) => {
            println!("Failed to get nba games by teams and season: {:?}", e);
            HttpResponse::InternalServerError().body(format!("{:?}", e))
        }
    }
}

pub async fn get_nba_odds_by_team_and_season(
    app_state: web::Data<AppState>, 
    req: web::Query<GetNbaOddsReqByTeamAndSeason>
) -> impl Responder {
    println!("Recieved req for nba_historical_odds_req team: {}, season: {}", req.teamName, req.season);
    let objs_result = nba_odds_historical_mongo_dao::get_nba_odds_by_team_and_season(
        &app_state.as_ref().nba_odds_historical_collection, 
        &req.teamName,
        req.season
    ).await; 

    match objs_result {
        Ok(objs) => {
            println!("Returned {} docs from mongo", objs.len());
            HttpResponse::Ok().json(objs)
        },
        Err(e) => {
            println!("Failed to get nba odds by teams and season: {:?}", e);
            HttpResponse::InternalServerError().body(format!("{:?}", e))
        }
    }
}

pub async fn test() -> HttpResponse {
    HttpResponse::Ok().body("Test!")
}