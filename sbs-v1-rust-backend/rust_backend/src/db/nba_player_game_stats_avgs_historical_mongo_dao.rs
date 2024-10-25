use crate::db::base_mongo::find;
use crate::models::enums::season_type::SeasonType;
use mongodb::Collection;
use mongodb::bson::{doc, Document, from_document};
use mongodb::error::Result;
use crate::models::db::nba_player_game_stats_avgs_historical::NbaPlayerGameStatsAvgsHistorical;

pub async fn get_nba_player_stats_avgs_by_id_and_season(
    collection: &Collection<Document>, 
    player_id: f64, 
    season: &str,
    season_type: Option<SeasonType>
) -> Result<Vec<NbaPlayerGameStatsAvgsHistorical>> {
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

    let mapped_results: Vec<NbaPlayerGameStatsAvgsHistorical> = results.iter()
        .flat_map(|doc| {
            match from_document::<NbaPlayerGameStatsAvgsHistorical>(doc.clone()) {
                Ok(obj) => Some(obj),
                Err(e) => {
                    println!("Failed to convert doc to obj: {}", e);
                    None
                }
            }
        })
        .collect();

    Ok(mapped_results)
}

