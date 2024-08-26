use mongodb::Collection;
use mongodb::bson::Document;

// Define a struct to hold both collections
#[derive(Clone)]
pub struct AppState {
    pub nba_games_historical_collection: Collection<Document>,
    pub nba_odds_historical_collection: Collection<Document>,
}