use actix_web::{ web, HttpResponse, Responder};
use crate::models::services::get_nba_games_req_by_team_and_season::GetNbaGameReqByTeamAndSeason;
use crate::db::nba_games_historical_mongo_dao;
use mongodb::Collection;
use mongodb::bson::Document;

pub async fn get_nba_games_by_team_and_season(
    collection: web::Data<Collection<Document>>, 
    req: web::Query<GetNbaGameReqByTeamAndSeason>
) -> impl Responder {
    println!("Recieved req for nba_historical_game_req team: {}, season: {}", req.teamNickname, req.season);
    let objs_result = nba_games_historical_mongo_dao::get_nba_games_by_team_and_season(collection.as_ref(), &req.teamNickname, req.season).await; 

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

pub async fn test() -> HttpResponse {
    HttpResponse::Ok().body("Test!")
}