use mongodb::Collection;
use mongodb::bson::Document;
use std::env;

#[derive(Clone)]
pub struct AppState {
    pub nba_games_historical_collection: Collection<Document>,
    pub nba_odds_historical_collection: Collection<Document>,
    pub nba_player_aggregated_game_stats_historical_collection: Collection<Document>,
    pub nba_team_aggregated_game_stats_historical_collection: Collection<Document>,
    pub nba_team_stats_collection: Collection<Document>,
    pub user_info_collection: Collection<Document>,
    pub cached_web_api_response_collection: Collection<Document>
}

impl AppState {
    pub fn get_collection(&self, collection_str: &str) -> Option<Collection<Document>> {
        match collection_str {
            "nba_games_historical_collection" => Some(self.nba_games_historical_collection.clone()),
            "nba_odds_historical_collection" => Some(self.nba_odds_historical_collection.clone()),
            "nba_player_aggregated_game_stats_historical_collection" => Some(self.nba_player_aggregated_game_stats_historical_collection.clone()),
            "nba_team_aggregated_game_stats_historical_collection" => Some(self.nba_team_aggregated_game_stats_historical_collection.clone()), 
            "nba_team_stats_collection" => Some(self.nba_team_stats_collection.clone()),
            "user_info_collection" => Some(self.user_info_collection.clone()),
            "cached_web_api_response_collection" => Some(self.cached_web_api_response_collection.clone()),
            _ => None
        }
    }
}

pub fn get_env() -> String {
    match env::var("ENV") {
        Ok(curr_env) => curr_env,
        Err(_e) => "dev".to_string()
    }
}