use std::str::FromStr;
use crate::models::{db::{nba_team_agg_game_stats_historical::{GameStats, NbaTeamAggGameStatsHistorical}, nba_team_stats::NbaTeamStats}, enums::season_type::SeasonType};


/** enums ***********************************************************************/
/********************************************************************************/
enum GameLocation {
    Home,
    Away,
    Total
}
/********************************************************************************/

/** aggregator funcs ************************************************************/
/********************************************************************************/
pub fn map_nba_team_aggregated_game_stats_to_nba_team_stats(
    tags: Vec<NbaTeamAggGameStatsHistorical>
) -> Vec<NbaTeamStats> {
    tags.into_iter()
        .map(|tag| {

            if tag.game_stats.to_owned().is_empty() {
                NbaTeamStats {
                    mongo_id: format!("{:?}-{:?}-{}", tag.team_id as u32, tag.season, tag.season_type),
                    team_id: tag.team_id,
                    team_name: tag.team_name,
                    team_nickname: tag.team_nickname,
                    season: tag.season,
                    season_type: SeasonType::from_str(&tag.season_type).unwrap_or(SeasonType::ALL),
                    last_game_id: 0,
                    total_streak: "-".to_string(),
                    home_streak: "-".to_string(),
                    away_streak: "-".to_string(),
                    total_wins: 0,
                    total_losses: 0,
                    last_ten_total_wins: 0,
                    last_ten_total_losses: 0,
                    home_wins: 0,
                    home_losses: 0,
                    last_ten_home_wins: 0,
                    last_ten_home_losses: 0,
                    away_wins: 0,
                    away_losses: 0,
                    last_ten_away_wins: 0,
                    last_ten_away_losses: 0,
                }
            } else {
                let game_stats = tag.game_stats.to_owned().into_values().collect();
                let sorted_game_stats = sort_game_stats_last_to_first(game_stats);

                NbaTeamStats {
                    mongo_id: format!("{:?}-{:?}-{}", tag.team_id as u32, tag.season, tag.season_type),
                    team_id: tag.team_id,
                    team_name: tag.team_name,
                    team_nickname: tag.team_nickname,
                    season: tag.season,
                    season_type: SeasonType::from_str(&tag.season_type).unwrap_or(SeasonType::ALL),
                    last_game_id: sorted_game_stats.get(0).unwrap().game_id,
                    total_streak: get_streak(sorted_game_stats.clone(), GameLocation::Total),
                    home_streak: get_streak(sorted_game_stats.clone(), GameLocation::Home),
                    away_streak: get_streak(sorted_game_stats.clone(), GameLocation::Away),
                    total_wins: num_wins(sorted_game_stats.clone(), None, GameLocation::Total),
                    total_losses: num_losses(sorted_game_stats.clone(), None, GameLocation::Total),
                    last_ten_total_wins:  num_wins(sorted_game_stats.clone(), Some(10), GameLocation::Total),
                    last_ten_total_losses:  num_losses(sorted_game_stats.clone(), Some(10), GameLocation::Total),
                    home_wins: num_wins(sorted_game_stats.clone(), None, GameLocation::Home),
                    home_losses: num_losses(sorted_game_stats.clone(), None, GameLocation::Home),
                    last_ten_home_wins: num_wins(sorted_game_stats.clone(), Some(10), GameLocation::Home),
                    last_ten_home_losses: num_losses(sorted_game_stats.clone(), Some(10), GameLocation::Home),
                    away_wins: num_wins(sorted_game_stats.clone(), None, GameLocation::Away),
                    away_losses: num_losses(sorted_game_stats.clone(), None, GameLocation::Away),
                    last_ten_away_wins: num_wins(sorted_game_stats.clone(), Some(10), GameLocation::Away),
                    last_ten_away_losses: num_losses(sorted_game_stats.clone(), Some(10), GameLocation::Away),
                }
            }
        })
        .collect()
}

fn get_streak(sorted_game_stats: Vec<GameStats>, game_loc: GameLocation) -> String {
    let filtered_game_stats: Vec<GameStats> = sorted_game_stats.into_iter()
        .filter(|gs| {
            match game_loc {
                GameLocation::Home => gs.is_home,
                GameLocation::Away => !gs.is_home,
                GameLocation::Total => true
            }
        })
        .collect();

    match filtered_game_stats.get(0) {
        Some(gs) => {
            let streak_type = gs.win;

            let mut streak_count = 0;
            while 
                filtered_game_stats.get(streak_count).is_some() && 
                filtered_game_stats.get(streak_count).unwrap().win == streak_type {
                streak_count+=1;
            }
            
            match streak_type  {
                true => format!("{}W", streak_count),
                false => format!("{}L", streak_count)
            }
        },
        None => "0".to_string()
    }
}

fn num_wins(sorted_game_stats: Vec<GameStats>, segment_length: Option<u32>, game_loc: GameLocation) -> u32 {
    let full_len = sorted_game_stats.len();
    let filtered_game_stats: Vec<GameStats> = sorted_game_stats.into_iter()
        .take(segment_length.unwrap_or(full_len as u32) as usize)
        .filter(|gs| {
            let game_loc_bool_arg = match game_loc {
                GameLocation::Home => gs.is_home,
                GameLocation::Away => !gs.is_home,
                GameLocation::Total => true
            };
            gs.win && game_loc_bool_arg
        })
        .collect();
    filtered_game_stats.len() as u32
}

fn num_losses(sorted_game_stats: Vec<GameStats>, segment_length: Option<u32>, game_loc: GameLocation) -> u32 {
    let full_len = sorted_game_stats.len();
    let filtered_game_stats: Vec<GameStats> = sorted_game_stats.into_iter()
        .take(segment_length.unwrap_or(full_len as u32) as usize)
        .filter(|gs| {
            let game_loc_bool_arg = match game_loc {
                GameLocation::Home => gs.is_home,
                GameLocation::Away => !gs.is_home,
                GameLocation::Total => true
            };
            !gs.win && game_loc_bool_arg
        })
        .collect();
    filtered_game_stats.len() as u32
}
/********************************************************************************/

/** helpers *********************************************************************/
/********************************************************************************/
fn sort_game_stats_last_to_first(mut game_stats: Vec<GameStats>) -> Vec<GameStats> {
    game_stats.sort_by(|x, y| y.date_start.cmp(&x.date_start));
    game_stats
}
/********************************************************************************/
