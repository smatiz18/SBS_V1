
#![allow(dead_code)]

use std::collections::HashMap;
use once_cell::sync::Lazy;

#[derive(Clone)]
pub struct SeasonDateObj {
    pub regular_season_start: &'static str,
    pub regular_season_end: &'static str,
    pub playoff_season_start: &'static str,
    pub playoff_season_end: &'static str,
    pub all_season_start: &'static str,
    pub all_season_end: &'static str
}

static NBA_SEASON_DATE_MAP: Lazy<HashMap<i32, SeasonDateObj>> = Lazy::new(|| {
    let mut map = HashMap::new();
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
    map
});
    
   