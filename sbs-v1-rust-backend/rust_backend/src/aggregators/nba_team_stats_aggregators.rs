use std::{fmt::format, str::FromStr};
use futures::future;

use bson::doc;

use crate::{db::nba_games_historical_mongo_dao, models::{app_state::AppState, db::{nba_team_agg_game_stats_historical::{GameStats, NbaTeamAggGameStatsHistorical}, nba_team_stats::NbaTeamStats}, enums::season_type::SeasonType}};

pub fn map_nba_team_aggregated_game_stats_to_nba_team_stats(
    app_state: AppState, 
    tags: Vec<NbaTeamAggGameStatsHistorical>
) -> Vec<NbaTeamStats> {
    tags.into_iter()
        .map(|tag| {

            if tag.game_stats.to_owned().is_empty() {
                NbaTeamStats {
                    mongo_id: format!("{:?}-{:?}-{:?}", tag.team_id, tag.season, tag.season_type),
                    team_id: tag.team_id,
                    season: tag.season,
                    season_type: SeasonType::from_str(&tag.season_type).unwrap_or(SeasonType::ALL),
                    last_game_id: 0,
                    total_wins: 0,
                    total_losses: 0,
                    total_streak: 0,
                    home_wins: 0,
                    home_losses: 0,
                    home_streak: 0,
                    away_wins: 0,
                    away_losses: 0,
                    away_streak: 0,
                    streak_type: None
                }
            } else {
                let last_game_id = tag.game_stats.to_owned()
                .into_values()
                .max_by(|x, y| x.date_start.cmp(&y.date_start))
                .unwrap()
                .game_id;

                let total_wins = tag.game_stats.to_owned()
                    .into_values()
                    .fold(0, |acc, gs| {
                        let mut res;
                        if gs.win {
                            res = acc + 1;
                        }
                        res
                    });

                let game_stats = tag.game_stats.into_values().collect::<Vec<GameStats>>();

                game_stats
                    .sort_by(|x, y| y.date_start.cmp(&x.date_start));
                
                let all_streak_type = last_10_game_stats.get(0).unwrap().win;
            

                // TODO add isHome field to game stats agg obj

                // TODO add isHome and win field to player stats agg obj 
                // let home_streak_type = 
                // let away_steak_type: bool = 


                NbaTeamStats {
                    mongo_id: format!("{:?}-{:?}-{:?}", tag.team_id, tag.season, tag.season_type),
                    team_id: tag.team_id,
                    season: tag.season,
                    season_type: SeasonType::from_str(&tag.season_type).unwrap_or(SeasonType::ALL),
                    last_game_id: last_game_id,
                    total_wins: total_wins,
                    total_losses: (tag.game_stats.into_values().len() as u32) - total_wins,
                    total_streak: ,
                    home_wins: todo!(),
                    home_losses: todo!(),
                    home_streak: todo!(),
                    away_wins: todo!(),
                    away_losses: todo!(),
                    away_streak: todo!(),
                    streak_type:
                }
            }
        })
        .collect()
    }


fn get_num_home_wins(num: u32, games: Vec<>)