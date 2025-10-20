
#![allow(dead_code)]

use std::collections::HashMap;
use chrono::Local;
use once_cell::sync::Lazy;

use crate::models::enums::season_type::SeasonType;

#[derive(Clone)]
pub struct SeasonDateObj {
    pub regular_season_start: &'static str,
    pub regular_season_end: &'static str,
    pub playoff_season_start: &'static str,
    pub playoff_season_end: &'static str,
    pub all_season_start: &'static str,
    pub all_season_end: &'static str
}

pub static NBA_SEASON_DATE_MAP: Lazy<HashMap<u32, SeasonDateObj>> = Lazy::new(|| {
    let mut map  = HashMap::new();
    map.insert(
        2023, 
        SeasonDateObj {
            regular_season_start: "2023-10-24",
            regular_season_end: "2024-04-14",
            playoff_season_start: "2024-04-20",
            playoff_season_end: "2024-06-20",
            all_season_start: "2023-10-24",
            all_season_end: "2024-06-20",
        }
    );
    map.insert(
        2024,
        SeasonDateObj {
            regular_season_start: "2024-10-22",
            regular_season_end: "2025-04-13",
            playoff_season_start: "2025-04-19",
            playoff_season_end: "2025-06-30",
            all_season_start: "2024-10-22",
            all_season_end: "2025-06-30",
        }
    );
    map.insert(
        2025,
        SeasonDateObj {
            regular_season_start: "2025-10-21",
            regular_season_end: "2026-04-12", 
            playoff_season_start: "2026-04-14",
            playoff_season_end: "2026-06-30",
            all_season_start: "2025-10-21",
            all_season_end: "2026-06-30",
        }
    );
    map
});

pub fn get_season_types(season_date_map: HashMap<u32, SeasonDateObj>, season: u32) -> Vec<SeasonType> {
    match season_date_map.get(&season)  {
        Some(season_date_obj) => {
            let today = Local::now();
            let iso_date: String = today.format("%Y-%m-%d").to_string();

            let mut season_types: Vec<SeasonType> = vec!();
            if season_date_obj.all_season_start.to_string() <= iso_date && iso_date <= season_date_obj.all_season_end.to_string() {
                season_types.push(SeasonType::ALL);
            }
            if season_date_obj.regular_season_start.to_string() <= iso_date && iso_date <= season_date_obj.regular_season_end.to_string() {
                season_types.push(SeasonType::REGULAR);
            }
            if season_date_obj.playoff_season_start.to_string() <= iso_date && iso_date <= season_date_obj.playoff_season_end.to_string() {
                season_types.push(SeasonType::PLAYOFF);
            }

            season_types
        },
        None => vec![SeasonType::ALL],
    }
}
    
   