use std::collections::{HashMap, HashSet};
use log::error;
use crate::models::{aggregators::optimal_odds::OptimalOdds, enums::bookmakers::Bookmakers, odds::odds::{Bookmaker, Event, Market, Outcome}};

 /** optimal odds funcs **********************************************************/
/********************************************************************************/
pub fn get_team_optimal_odds_by_event_map(events: Vec<Event>) -> HashMap<String, Vec<OptimalOdds>> {
    events.into_iter()
        .map(|event| (event.id, get_optimal_odds(event.bookmakers.unwrap_or(vec!()))))
        .collect()
} 

pub fn get_player_optimal_odds_by_event_map(events: Vec<Event>) -> HashMap<String, HashMap<String, Vec<OptimalOdds>>> {
    let unique_players = get_unique_players_from_events(events.clone());
    events.clone()
        .into_iter()
        .map(|event: Event| {
            let opt_odds_mapped_by_player: HashMap<String, Vec<OptimalOdds>> = unique_players.clone()
                .into_iter()
                .map(|player_name: String| {
                    let filtered_event = filter_event_odds_by_description(event.clone(), player_name.clone());
                    (player_name, get_optimal_odds(filtered_event.bookmakers.unwrap_or(vec!())))
                })
                .collect();
            (event.id, opt_odds_mapped_by_player)
        })
        .collect()
}

pub fn get_optimal_odds(bookmakers: Vec<Bookmaker>) -> Vec<OptimalOdds> {
    let unfiltered_odds_obj = map_bookmaker_obj_to_optimal_odds(bookmakers);
    let mut odds_obj_map: HashMap<String, OptimalOdds> = HashMap::new();

    unfiltered_odds_obj.into_iter()
        .for_each(|odds_obj| {
            let key = format!("{:?}{:?}", odds_obj.name, odds_obj.bet_type);
            if odds_obj_map.contains_key(&key) {
                if odds_obj_map.get_mut(&key).as_mut().unwrap().price < odds_obj.price {
                    odds_obj_map.insert(key, odds_obj);
                }
            } else {
                odds_obj_map.insert(key, odds_obj);
            }
        });

    return odds_obj_map.values()
        .cloned()
        .collect::<Vec<OptimalOdds>>();
}

pub fn map_bookmaker_obj_to_optimal_odds(bookmakers: Vec<Bookmaker>) -> Vec<OptimalOdds> {
    bookmakers.into_iter()
        .flat_map(|bookmaker: Bookmaker| {
            let parsed_sportsbook: Result<Bookmakers, _> = bookmaker.title.parse();

            let odds_optimization_objs: Vec<OptimalOdds> = match parsed_sportsbook {
                Ok(sportsbook) => {
                    bookmaker.markets
                        .into_iter()
                        .flat_map(|market: Market| 
                            market.outcomes
                                .into_iter()
                                .map(|outcome: Outcome|
                                    OptimalOdds {
                                        bookmaker: sportsbook.to_owned(),
                                        name: outcome.name,
                                        price: outcome.price,
                                        point: outcome.point,
                                        bet_type: market.key.to_owned(),
                                        player_name: None
                                    }
                                )
                                .collect::<Vec<OptimalOdds>>()
                        )
                        .collect()
                },
                Err(e) => {
                    error!("Unable to parse bookmaker: {:?}", e);
                    return vec![];
                }
            };

            return odds_optimization_objs
        })
        .collect()
}
/********************************************************************************/

/** helpers *********************************************************************/
/********************************************************************************/
fn get_unique_players_from_events(events: Vec<Event>) -> HashSet<String> {
    let mut unique_player_set: HashSet<String> = HashSet::new(); 
    events.into_iter()
        .for_each(|event: Event| {
            event.bookmakers
                .unwrap_or(vec!())
                .into_iter()
                .for_each(|bookmaker: Bookmaker| {
                    bookmaker.markets
                        .into_iter()
                        .for_each(|market: Market| {
                            market.outcomes
                                .into_iter()
                                .for_each(|outcome: Outcome| {
                                    if outcome.description.is_some() {
                                        unique_player_set.insert(outcome.description.unwrap());
                                    }
                                });
                        });
                });
        });

        unique_player_set
}

fn filter_event_odds_by_description(event: Event, desc: String) -> Event {
    let filtered_bookmakers = event.bookmakers
        .unwrap_or(vec!())
        .into_iter()
        .map(|bookmaker: Bookmaker| {
            let filtered_markets = bookmaker.markets
                .into_iter()
                .map(|market: Market| {
                    let filtered_outcomes: Vec<Outcome> = market.outcomes
                        .into_iter()
                        .filter(|outcome: &Outcome| outcome.description.as_deref().unwrap_or("no name") == desc)
                        .collect();
                    Market {
                        key: market.key,
                        last_update: market.last_update,
                        outcomes: filtered_outcomes,
                    }
                })
                .collect();

            Some(
                Bookmaker {
                    key: bookmaker.key,
                    title: bookmaker.title,
                    last_update: bookmaker.last_update,
                    markets: filtered_markets,
               }
            )
        })
        .collect();

    Event {
        id: event.id,
        sport_key: event.sport_key,
        sport_title: event.sport_title,
        commence_time: event.commence_time,
        home_team: event.home_team,
        away_team: event.away_team,
        bookmakers: filtered_bookmakers,
    }
}
/********************************************************************************/