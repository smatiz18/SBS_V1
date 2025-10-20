use std::{env, fs};

use chrono::Local;
use log::info;
use rust_backend::{constants::ec2_paths::DAILY_DATA_LOADERS_LOG_PATH, data_loaders::nba::daily_loaders::{daily_nba_game_data_loader, daily_nba_player_data_loader, load_nba_daily_stats_cache, daily_nba_odds_loader}, initializers::initialize_app_state, utils::email_util::send_email};

pub const CURRENT_SEASON: u32 = 2025;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    /* Run processes */
    env_logger::init();
    
    let app_state = initialize_app_state().await?;
    
    let mut errors: Vec<String> = vec!();
    info!("---------------- Running daily NBA Game Data Loader! ----------------");
    let _ = match daily_nba_game_data_loader() {
        Err(e) => {
            errors.push(e.to_string());
        },
        _ => {}
    };
    info!("---------------- Complete! ----------------");

    info!("---------------- Running daily NBA Player Data Loader! ----------------");
    let _ = match daily_nba_player_data_loader() {
        Err(e) => {
            errors.push(e.to_string())
        }, 
        _ => {}
    };
    info!("---------------- Complete! ----------------");

    info!("---------------- Running daily NBA Team Stats Loader! ----------------");
    let _ = match load_nba_daily_stats_cache(app_state, CURRENT_SEASON).await {
        Ok(output) => info!("{}", output),
        Err(e) => {
            errors.push(e)
        }
    };
    info!("---------------- Complete! ----------------");

    info!("---------------- Running daily NBA Odds Loader! ----------------");
    let _ = match daily_nba_odds_loader() {
        Err(e) => {
            errors.push(e.to_string());
        },
        _ => {}
    };
    info!("---------------- Complete! ----------------");

    /* Send email verification */
    let today = Local::now();
    let iso_date = today.format("%Y-%m-%d").to_string();
    let daily_loaders_subject_root = format!("SBS V1 Daily Data Loaders Job Complete: {}", iso_date);
    let home_path: &str = &env::var("HOME").expect("HOME environment var is not set!");
    let std_out = match fs::read_to_string(format!("{}/{}", home_path, DAILY_DATA_LOADERS_LOG_PATH)) {
        Ok(out) => out,
        Err(_e) => "Logs unavailable".to_owned()
    };
    let body_as_std_out = format!("STDOUT: {}", std_out);
    if errors.len() > 0 {
        let errors_as_str = errors.join("\n");
        let subject = format!("{}: ERRORS", daily_loaders_subject_root);
        let body = format!("ERROS: {}\n\n{}", errors_as_str, body_as_std_out);
        let _ = send_email(&subject, &body);
    } else {
        let _ = send_email(&daily_loaders_subject_root, &body_as_std_out);
    }

    info!("Loader job complete!");

    Ok(())
}