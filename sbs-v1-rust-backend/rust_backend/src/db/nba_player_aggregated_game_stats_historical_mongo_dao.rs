use crate::db::base_mongo::find;
use crate::models::db::nba_player_agg_game_stats_historical::NbaPlayerAggGameStatsHistorical;
use crate::models::enums::season_type::SeasonType;
use crate::models::services::get_nba_player_stats_by_name_season_request::Name;
use mongodb::Collection;
use mongodb::bson::{doc, Document, from_document};
use mongodb::error::Result;

pub async fn get_nba_agg_player_stats_by_id_and_season(
    collection: &Collection<Document>, 
    player_id: f64, 
    season: i32,
    season_type: Option<SeasonType>
) -> Result<Vec<NbaPlayerAggGameStatsHistorical>> {
    let query = match season_type {
        Some(s) => {
           let json_string = serde_json::to_string(&s).unwrap();
           let trimmed = &json_string[1..json_string.len()-1];  
           doc! { 
              "playerId": player_id as i32,
              "season": season,
              "seasonType": trimmed
           }
        },
        None => 
            doc! { 
                "playerId": player_id,
                "season": season,
            },    
        };
     
    let results = find(&collection, query, None).await?;
    let mapped_results: Vec<NbaPlayerAggGameStatsHistorical> = parse_doc_to_obj(results);
    Ok(mapped_results)
}

pub async fn get_nba_agg_player_stats_by_name_and_season(
    collection: &Collection<Document>,
    names: Vec<Name>,
    season: i32,
    season_type: Option<SeasonType>
) -> Result<Vec<NbaPlayerAggGameStatsHistorical>> {
    let names_query: Vec<Document> = names.into_iter()
        .map(|name: Name| {
            doc! {
                "$and": [
                    { "firstname": name.firstname },
                    { "lastname":  name.lastname }
                ]
            }
        })
        .collect();

    let query = match season_type {
        Some(s) => {
           let json_string = serde_json::to_string(&s).unwrap();
           let trimmed = &json_string[1..json_string.len()-1];  
           doc! { 
              "$or": names_query,
              "season": season,
              "seasonType": trimmed
           }
        },
        None => 
            doc! { 
                "$or": names_query,
                "season": season,
            },    
        };
     
    let results = find(&collection, query, None).await?;
    let mapped_results: Vec<NbaPlayerAggGameStatsHistorical> = parse_doc_to_obj(results);
    Ok(mapped_results)
}

fn parse_doc_to_obj(docs: Vec<Document>) -> Vec<NbaPlayerAggGameStatsHistorical> {
    docs.iter()
        .flat_map(|doc| {
            match from_document::<NbaPlayerAggGameStatsHistorical>(doc.clone()) {
                Ok(obj) => Some(obj),
                Err(e) => {
                    println!("Failed to convert doc to obj: {}", e);
                    None
                }
            }
        })
        .collect()
}

