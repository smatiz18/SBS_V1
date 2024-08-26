mod db;
mod models;
mod handlers;
mod routes;
mod proxy;

use std::env;
use actix_web::{web, App, HttpServer };
use db::base_mongo::get_collection;
use handlers::handlers::{get_nba_games_by_team_and_season, get_nba_odds_by_team_and_season, test};
use routes::endpoints::{NBA_API_ROOT, GET_HISTORICAL_GAMES, GET_HISTORICAL_ODDS, SERVER_URL};
use db::constants::{SBS_V1_DB_NAME, NBA_GAMES_HISTORICAL_COLLECTION_NAME, NBA_ODDS_HISTORICAL_COLLECTION_NAME};
use proxy::proxy_handler::proxy;
use actix_cors::Cors;
use models::app_state::AppState;

#[actix_web::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
   // Load the MongoDB connection string from an environment variable:
   let client_uri =
      env::var("SBS_V1_MONGO_URI").expect("You must set the SBS_V1_MONGO_URI environment var!");

   let nba_games_historical_collection = get_collection(
      &client_uri, 
      SBS_V1_DB_NAME, 
      NBA_GAMES_HISTORICAL_COLLECTION_NAME
   ).await?;
   let nba_odds_historical_collection = get_collection(
      &client_uri, 
      SBS_V1_DB_NAME, 
      NBA_ODDS_HISTORICAL_COLLECTION_NAME
   ).await?;

   // Wrap collections in AppState
   let app_state = AppState {
      nba_games_historical_collection: nba_games_historical_collection.clone(),
      nba_odds_historical_collection: nba_odds_historical_collection.clone(),
   };

   HttpServer::new(move || {
        App::new()
        .wrap(
            Cors::default()
               .allow_any_origin()  // Allow all origins
               .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
               .allowed_headers(vec!["Content-Type", "Authorization"])
               .max_age(3600),
         )
        .app_data(web::Data::new(app_state.clone())) // Share the collection with the app state
        .service(
            web::scope(NBA_API_ROOT)
                .route(GET_HISTORICAL_GAMES, web::get().to(get_nba_games_by_team_and_season))
                .route(GET_HISTORICAL_ODDS, web::get().to(get_nba_odds_by_team_and_season))
                .route("/test", web::get().to(test))
         )
         .default_service(web::route().to(proxy))  // Uses the proxy handler for all unmatched routes
    })
    .bind(SERVER_URL)?
    .run()
    .await;

   Ok(())
}
