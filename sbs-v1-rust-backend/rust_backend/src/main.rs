// Import the db module
mod db;
mod models;
mod handlers;

use std::env;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};
use db::base_mongo::{get_document_count, get_collection, find_documents};
use models::db::nba_games_historical::NbaGamesHistorical;
use mongodb::bson::{doc, from_document};
use handlers::handlers::get_nba_games_by_season_and_team;

#[get("/nba-games-historical/get")]
async fn get_nba_games_historical() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

const SBS_V1_DB_NAME: &str = "SBSV1";
const COLLECTION_NAME: &str = "nba_games_historical";


#[actix_web::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
   // Load the MongoDB connection string from an environment variable:
   let client_uri =
      env::var("SBS_V1_MONGO_URI").expect("You must set the SBS_V1_MONGO_URI environment var!");

   // Get the collection, await the result
   let collection = get_collection(&client_uri, SBS_V1_DB_NAME, COLLECTION_NAME).await?;

   // Now, pass the collection to the get_document_count function
   let count = get_document_count(&collection).await?;

   println!("Number of documents in the collection: {}", count);

   // Define your query
   let query = doc! { "teamsHomeNickname": "Lakers" };

   // Use the function to find documents
   let results = find_documents(&collection, query).await?;

   let mapped_results: Vec<NbaGamesHistorical> = results.iter()
      .flat_map(|doc| 
         match from_document::<NbaGamesHistorical>(doc.clone()) {
            Ok(obj) => Some(obj),
            Err(e) => {
               println!("Failed to convert doc to obj: {}", e);
               None
            }
         }
      )
      .collect();

   HttpServer::new(|| {
        App::new()
            .service(get_nba_games_by_season_and_team)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await?;

   Ok(())
}
