use actix_web::{get, web, HttpResponse, Responder};
use crate::models::services::get_nba_games_req_by_team_and_season::GetNbaGameReqByTeamAndSeason;

#[get("/nba-games/get")]
async fn get_nba_games_by_season_and_team(req: web::Path<GetNbaGameReqByTeamAndSeason>) -> impl Responder {
    println!("Request: {:?}", req);
    HttpResponse::Ok().body(format!("Request: {:?}", req))
}