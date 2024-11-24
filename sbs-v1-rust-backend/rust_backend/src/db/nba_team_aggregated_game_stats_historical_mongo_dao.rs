use bson::{doc, from_document, Document};
use mongodb::Collection;
use crate::db::base_mongo::find;
use crate::models::db::nba_team_agg_game_stats_historical::NbaTeamAggGameStatsHistorical;
use crate::models::enums::season_type::SeasonType;
use mongodb::error::Result;

pub async fn get_nba_team_agg_game_stats(
    collection: &Collection<Document>, 
    team_ids_opt: Option<Vec<f64>>, 
    season_opt: Option<u32>,
    season_type_opt: Option<SeasonType>
) -> Result<Vec<NbaTeamAggGameStatsHistorical>> {
   
   let mut query: Document = doc! {};
   if team_ids_opt.is_some() {
      query.insert("teamId",  doc! { "$in": team_ids_opt.unwrap() });
   }
   if season_opt.is_some() {
      query.insert("season", season_opt.unwrap());
   }
   if season_type_opt.is_some() {
      query.insert("seasonType", season_type_opt.unwrap().to_string());
   }

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