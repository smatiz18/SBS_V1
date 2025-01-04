use mongodb::Collection;
use mongodb::bson::Document;

#[derive(Clone)]
pub struct AppState {
    pub nba_games_historical_collection: Collection<Document>,
    pub nba_odds_historical_collection: Collection<Document>,
    pub nba_player_aggregated_game_stats_historical_collection: Collection<Document>,
    pub nba_team_aggregated_game_stats_historical_collection: Collection<Document>,
    pub nba_team_stats_collection: Collection<Document>
}

impl AppState {
    pub fn get_collection(collection_str: &str) -> Option<Collection<Document>> {
        match collection_str {
            "nba_games_historical_collection" => Some(&self.nba_games_historical_collection),
            // "nba_odds_historical_collection" => ,
            // "nba_player_aggregated_game_stats_historical_collection" => ,
            // "nba_team_aggregated_game_stats_historical_collection" => , 
            // "nba_team_stats_collection" => 
            _ => None
        }
    }
}