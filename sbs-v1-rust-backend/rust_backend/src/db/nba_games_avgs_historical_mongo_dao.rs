use bson::{doc, from_document, Document};
use mongodb::Collection;
use crate::db::base_mongo::find_documents;
use crate::models::db::nba_games_avgs_historical::NbaGamesAvgsHistorical;
use mongodb::error::Result;

pub async fn get_nba_games_avgs_by_team_and_season(
    collection: &Collection<Document>, 
    team_id: f64, 
    season: u32
) -> Result<Vec<NbaGamesAvgsHistorical>> {

    let query = doc! { 
        "teamId": team_id,
        "season": season
    };

   let results = find_documents(&collection, query).await?;

   let mapped_results: Vec<NbaGamesAvgsHistorical> = results.iter()
      .flat_map(|doc| 
         match from_document::<NbaGamesAvgsHistorical>(doc.clone()) {
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