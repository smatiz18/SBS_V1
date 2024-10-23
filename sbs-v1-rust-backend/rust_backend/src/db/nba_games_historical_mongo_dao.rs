use crate::db::base_mongo::find as base_find;
use mongodb::options::FindOptions;
use mongodb::Collection;
use mongodb::bson::{doc, Document, from_document};
use crate::models::db::nba_games_historical::NbaGamesHistorical;
use mongodb::error::Result;

pub async fn get_nba_games_by_team_and_season(
   collection: &Collection<Document>, 
   team_id: f64, 
   season: u32
) -> Result<Vec<NbaGamesHistorical>> {
   let query = doc! { 
        "$or": [ 
            { "teamsHomeId": team_id }, 
            { "teamsVisitorsId": team_id }
        ],
        "season": season
    };

   find(collection, query, None).await
} 

pub async fn find(
   collection: &Collection<Document>,
   match_query: Document,
   options: Option<FindOptions>
) -> Result<Vec<NbaGamesHistorical>> {
   let results = base_find(&collection, match_query, options).await?;
    Ok(parse_doc_to_obj(results))
}

fn parse_doc_to_obj(
   docs: Vec<Document>
) -> Vec<NbaGamesHistorical> {
   docs.iter()
      .flat_map(|doc| 
         match from_document::<NbaGamesHistorical>(doc.clone()) {
            Ok(obj) => Some(obj),
            Err(e) => {
               println!("Failed to convert doc to obj: {}", e);
               None
            }
         }
      )
      .collect()
}
