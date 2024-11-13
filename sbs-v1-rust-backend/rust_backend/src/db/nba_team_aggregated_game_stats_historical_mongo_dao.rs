use bson::{doc, from_document, Document};
use mongodb::Collection;
use crate::db::base_mongo::find;
use crate::models::db::nba_team_agg_game_stats_historical::NbaTeamAggGameStatsHistorical;
use crate::models::enums::season_type::SeasonType;
use mongodb::error::Result;

pub async fn get_nba_team_agg_game_stats(
    collection: &Collection<Document>, 
    team_ids: Vec<f64>, 
    season: u32,
    season_type: Option<SeasonType>
) -> Result<Vec<NbaTeamAggGameStatsHistorical>> {

   let query = match season_type {
      Some(s) => {
         let json_string = serde_json::to_string(&s).unwrap();
         let trimmed = &json_string[1..json_string.len()-1];  
         doc! { 
            "teamId": { "$in": team_ids },
            "season": season,
            "seasonType": trimmed
         }
      },
      None => 
         doc! { 
            "teamId": { "$in": team_ids },
            "season": season,
         },    
   };

   let results = find(&collection, query, None).await?;

   let mapped_results: Vec<NbaTeamAggGameStatsHistorical> = results.iter()
      .flat_map(|doc| 
         match from_document::<NbaTeamAggGameStatsHistorical>(doc.clone()) {
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