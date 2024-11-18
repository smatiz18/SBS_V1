use log::info;
use rust_backend::data_loaders::nba::daily_loaders::{daily_nba_game_data_loader, daily_nba_player_data_loader};

fn main() {
    env_logger::init();
    
    info!("---------------- Running daily NBA Game Data Loader! ----------------");
    let _ = daily_nba_game_data_loader();
    info!("---------------- Complete! ----------------");

    info!("---------------- Running daily NBA Player Data Loader! ----------------");
    let _ = daily_nba_player_data_loader();
    info!("---------------- Complete! ----------------");
}