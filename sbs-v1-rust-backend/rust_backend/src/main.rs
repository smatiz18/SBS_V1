mod db;
mod models;
mod handlers;
mod routes;

use std::env;
use actix_web::{web, App, HttpServer };
use db::base_mongo::get_collection;
use handlers::handlers::{get_nba_games_by_team_and_season, test};
use routes::endpoints::{NBA_API_ROOT, GET_HISTORICAL_GAMES};
use db::constants::{SBS_V1_DB_NAME, COLLECTION_NAME};

#[actix_web::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
   // Load the MongoDB connection string from an environment variable:
   let client_uri =
      env::var("SBS_V1_MONGO_URI").expect("You must set the SBS_V1_MONGO_URI environment var!");

   let collection = get_collection(&client_uri, SBS_V1_DB_NAME, COLLECTION_NAME).await?;

   HttpServer::new(move || {
        App::new()
        .app_data(web::Data::new(collection.clone())) // Share the collection with the app state
        .service(
            web::scope(NBA_API_ROOT)
                .route(GET_HISTORICAL_GAMES, web::get().to(get_nba_games_by_team_and_season))
                .route("/test", web::get().to(test))
         )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await;

   Ok(())
}
