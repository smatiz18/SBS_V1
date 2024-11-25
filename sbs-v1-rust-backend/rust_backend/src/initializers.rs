use std::env;
use crate::{db::{base_mongo::get_collection, constants::{NBA_GAMES_HISTORICAL_COLLECTION_NAME, NBA_ODDS_HISTORICAL_COLLECTION_NAME, NBA_PLAYER_AGGREGATED_GAME_STATS_HISTORICAL, NBA_TEAM_AGGREGATED_GAME_STATS_HISTORICAL, NBA_TEAM_STATS, SBS_V1_DB_NAME}}, models::app_state::AppState};

pub async fn initialize_app_state() -> Result<AppState, Box<dyn std::error::Error>> {
    // Load the MongoDB connection string from an environment variable:
    let client_uri =
        env::var("SBS_V1_MONGO_URI").expect("You must set the SBS_V1_MONGO_URI environment var!");

    let nba_games_historical_collection = get_collection(
        &client_uri, 
        SBS_V1_DB_NAME, 
        NBA_GAMES_HISTORICAL_COLLECTION_NAME
    ).await?;
    let nba_odds_historical_collection = get_collection(
        &client_uri, 
        SBS_V1_DB_NAME, 
        NBA_ODDS_HISTORICAL_COLLECTION_NAME
    ).await?;
    let nba_player_aggregated_game_stats_historical_collection = get_collection(
        &client_uri, 
        SBS_V1_DB_NAME, 
        NBA_PLAYER_AGGREGATED_GAME_STATS_HISTORICAL
    ).await?;
    let nba_team_aggregated_game_stats_historical_collection = get_collection(
        &client_uri, 
        SBS_V1_DB_NAME, 
        NBA_TEAM_AGGREGATED_GAME_STATS_HISTORICAL
    ).await?;
    let nba_team_stats_collection = get_collection(
        &client_uri, 
        SBS_V1_DB_NAME, 
        NBA_TEAM_STATS
    ).await?;

    // Wrap collections in AppState
    Ok(
        AppState {
            nba_games_historical_collection: nba_games_historical_collection.clone(),
            nba_odds_historical_collection: nba_odds_historical_collection.clone(),
            nba_player_aggregated_game_stats_historical_collection: nba_player_aggregated_game_stats_historical_collection.clone(),
            nba_team_aggregated_game_stats_historical_collection: nba_team_aggregated_game_stats_historical_collection.clone(),
            nba_team_stats_collection: nba_team_stats_collection.clone()
        }
    )
}