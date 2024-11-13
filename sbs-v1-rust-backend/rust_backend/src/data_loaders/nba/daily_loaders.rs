#![allow(dead_code)]
use crate::models::app_state::AppState;
/** Old loader logic that is already written in python will stay that way. In the future 
 * we should migrate this over to rust but for the sake of prototyping let's keep it in python
 */

async fn load_latest_nba_game_stats() {
    // let python_code = fs::read_to_string().expect("Failed to read Python file");
}

async fn load_latest_nba_player_stats(_app_state: AppState) {

}

async fn load_latest_nba_team_stats(_app_state: AppState) {

}

async fn load_historical_nba_game_stats(_app_state: AppState) {

}

async fn load_historical_nba_player_stats(_app_state: AppState) {

}

async fn load_historical_nba_team_stats(_app_state: AppState) {

}