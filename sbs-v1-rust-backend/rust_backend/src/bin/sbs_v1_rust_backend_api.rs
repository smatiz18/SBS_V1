use log::info;
use rust_backend::{handlers, initializers::initialize_app_state, proxy, routes};
use actix_web::{web, App, HttpServer };
use handlers::handlers::{
   get_feature_map_for_backtest, get_nba_games_by_team_and_season, get_nba_odds_by_team_and_season, get_nba_player_stats_by_id_and_season, get_nba_players_by_team_and_season, get_nba_team_agg_game_stats, get_odds, test
};
use routes::endpoints::{
   BACKTEST_API_ROOT, GET_BACKTEST_FEATURE_MAP, GET_NBA_TEAM_AGG_GAME_STATS, GET_HISTORICAL_GAMES, GET_HISTORICAL_ODDS, GET_ODDS, GET_PLAYERS_BY_TEAM_AND_SEASON, GET_PLAYER_STATS_BY_ID_AND_SEASON, NBA_API_ROOT, ODDS_API_ROOT, SERVER_URL
};
use proxy::proxy_handler::proxy;
use actix_cors::Cors;
use env_logger;

#[actix_web::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
   env_logger::init();

   // Wrap collections in AppState
   let app_state = initialize_app_state().await?;

   info!("---------------- Starting SBS V1 RUST BACKEND API ----------------");

   let _ = HttpServer::new(move || {
        App::new()
        .wrap(
            Cors::default()
               .allow_any_origin()  // Allow all origins
               .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
               .allowed_headers(vec!["Content-Type", "Authorization"])
               .max_age(3600),
         )
        .app_data(web::Data::new(app_state.clone())) // Share the collection with the app state
        .service(
            web::scope(BACKTEST_API_ROOT)
            .route(GET_BACKTEST_FEATURE_MAP, web::post().to(get_feature_map_for_backtest))
         )
         .service(
            web::scope(ODDS_API_ROOT)
            .route(GET_ODDS, web::post().to(get_odds))
         )
        .service(
            web::scope(NBA_API_ROOT)
               .route(GET_HISTORICAL_GAMES, web::get().to(get_nba_games_by_team_and_season))
               .route(GET_HISTORICAL_ODDS, web::get().to(get_nba_odds_by_team_and_season))
               .route(GET_PLAYERS_BY_TEAM_AND_SEASON, web::get().to(get_nba_players_by_team_and_season))
               .route(GET_PLAYER_STATS_BY_ID_AND_SEASON, web::get().to(get_nba_player_stats_by_id_and_season))
               .route(GET_NBA_TEAM_AGG_GAME_STATS, web::post().to(get_nba_team_agg_game_stats))
               .route("/test", web::get().to(test)),
         )
         .default_service(web::route().to(proxy))  // Uses the proxy handler for all unmatched routes
    })
    .bind(SERVER_URL)?
    .run()
    .await;

   Ok(())
}
