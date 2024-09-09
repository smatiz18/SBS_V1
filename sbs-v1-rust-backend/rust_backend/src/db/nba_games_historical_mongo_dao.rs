use crate::db::base_mongo::find_documents;
use mongodb::Collection;
use mongodb::bson::{doc, Document, from_document};
use crate::models::db::nba_games_historical::NbaGamesHistorical;
use mongodb::error::Result;

pub async fn get_nba_games_by_team_and_season(collection: &Collection<Document>, teamNickname: &str, season: f64) -> Result<Vec<NbaGamesHistorical>> {
   let query = doc! { 
        "$or": [ 
            { "teamsHomeNickname": teamNickname }, 
            { "teamsVisitorsNickname": teamNickname }
        ],
        "season": season
    };

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

    Ok(mapped_results)
} 