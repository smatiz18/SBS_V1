use crate::db::base_mongo::find_documents;
use mongodb::Collection;
use mongodb::bson::{doc, Document, from_document};
use crate::models::db::nba_odds_historical::NbaOddsHistorical;
use mongodb::error::Result;

pub async fn get_nba_odds_by_team_and_season(
   collection: &Collection<Document>, 
   team_name: &str, 
   season: f64
) -> Result<Vec<NbaOddsHistorical>> {
   let query = doc! { 
        "$or": [ 
            { "homeTeam": team_name }, 
            { "awayTeam": team_name }
        ],
        "season": season
    };

   let results = find_documents(&collection, query).await?;

   let mapped_results: Vec<NbaOddsHistorical> = results.iter()
      .flat_map(|doc| 
         match from_document::<NbaOddsHistorical>(doc.clone()) {
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