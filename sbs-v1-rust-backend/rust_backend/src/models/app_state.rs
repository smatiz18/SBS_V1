use mongodb::Collection;
use mongodb::bson::Document;

#[derive(Clone)]
pub struct AppState {
    pub nba_games_historical_collection: Collection<Document>,
    pub nba_odds_historical_collection: Collection<Document>,
    pub nba_player_aggregated_game_stats_historical_collection: Collection<Document>,
    pub nba_team_aggregated_game_stats_historical_collection: Collection<Document>
}