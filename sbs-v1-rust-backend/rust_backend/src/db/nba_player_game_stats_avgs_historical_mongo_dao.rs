use crate::db::base_mongo::find_documents;
use mongodb::Collection;
use mongodb::bson::{doc, Document, from_document};
use mongodb::error::Result;
use crate::models::db::nba_player_game_stats_avgs_historical::NbaPlayerGameStatsAvgsHistorical;

pub async fn get_nba_player_stats_avgs_by_id_and_season(
    collection: &Collection<Document>, 
    player_id: f64, 
    season: &str
) -> Result<Vec<NbaPlayerGameStatsAvgsHistorical>> {
    let query = doc! { 
        "playerId": player_id,
        "season": season
    };

    let results = find_documents(&collection, query).await?;

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