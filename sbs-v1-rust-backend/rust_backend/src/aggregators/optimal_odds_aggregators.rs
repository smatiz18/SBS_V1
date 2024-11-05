use std::collections::HashMap;
use log::error;
use crate::models::{aggregators::optimal_odds::OptimalOdds, enums::bookmakers::Bookmakers, odds::odds::{Bookmaker, Event, Market, Outcome}};

pub fn get_optimal_odds_by_event_map(events: Vec<Event>) -> HashMap<String, Vec<OptimalOdds>> {
    events.into_iter()
        .map(|event| (event.id, get_optimal_odds(event.bookmakers)))
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
                                        bet_type: market.key.to_owned()
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