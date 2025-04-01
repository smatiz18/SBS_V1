#![allow(dead_code)]

use std::fs;
use log::{error, info};

#[cfg(feature = "pyo3_required")]
use pyo3::{types::PyModule, Py, PyAny, PyResult, Python};

use crate::{aggregators::nba_team_stats_aggregators::map_nba_team_aggregated_game_stats_to_nba_team_stats, constants::{dates::{get_season_types, NBA_SEASON_DATE_MAP}, python_script_paths::{NBA_GAME_DATA_LOADER_RUNNER_FUNCTION, NBA_MONGO_LOADER_FILE, NBA_PLAYER_DATA_LOADER_RUNNER_FUNCTION, SBS_V1_PYTHON_BACKEND_MODULE, NBA_ODDS_MONGO_LOADER_FILE, NBA_ODDS_LOADER_RUNNER_FUNCTION}}, db::{nba_team_aggregated_game_stats_historical_mongo_dao, nba_team_stats_mongo_dao}, models::{app_state::AppState, db::{nba_team_agg_game_stats_historical::NbaTeamAggGameStatsHistorical, nba_team_stats::NbaTeamStats}}};

/** Old loader logic that is already written in python will stay that way. In the future 
 * we should migrate this over to rust but for the sake of prototyping let's keep it in python
 */

 #[cfg(feature = "pyo3_required")]
fn get_nba_mongo_loader_path() -> String {
    format!("../../{}/app/scripts/{}", SBS_V1_PYTHON_BACKEND_MODULE, NBA_MONGO_LOADER_FILE)
}

#[cfg(feature = "pyo3_required")]
fn get_nba_odds_mongo_loader_path() -> String {
    format!("../../{}/app/scripts/{}", SBS_V1_PYTHON_BACKEND_MODULE, NBA_ODDS_MONGO_LOADER_FILE)
}

#[cfg(feature = "pyo3_required")]
pub fn daily_nba_game_data_loader() -> PyResult<()> {
    let source_code = match fs::read_to_string(get_nba_mongo_loader_path()) {
        Ok(code) => {
            info!("---------------- loaded source code! ----------------");
            code
        },
        Err(e) => { 
            error!("---------------- failed to open filed at path ----------------: {:?}", e);
            return Ok(());
        }
    };

    Python::with_gil(|py| {
        let loader_source_code: Py<PyAny> = match PyModule::from_code_bound(
            py,
            &source_code,
            NBA_MONGO_LOADER_FILE,
            SBS_V1_PYTHON_BACKEND_MODULE
        ) {
            Ok(resp) => resp.into(),
            Err(e) => {
                error!("---------------- unable to load PyModule ----------------: {:?}", e);
                return Err(e);
            }
        };

        match loader_source_code.call_method0(py, NBA_GAME_DATA_LOADER_RUNNER_FUNCTION)  {
            Ok(res) => info!("---------------- Success in running run_nba_daily_games_data_loader ----------------: {:?}", res),
            Err(e) => {
                error!("---------------- Failed to run run_nba_daily_games_data_loader ----------------: {:?}", e);
                return Err(e);
            },
        };

        Ok(())
    })
}

#[cfg(feature = "pyo3_required")]
pub fn daily_nba_player_data_loader() -> PyResult<()> {
    let source_code = match fs::read_to_string(get_nba_mongo_loader_path()) {
        Ok(code) => {
            info!("---------------- loaded source code! ----------------");
            code
        },
        Err(e) => { 
            error!("---------------- failed to open filed at path ----------------: {:?}", e);
            return Err(e.into());
        }
    };


    Python::with_gil(|py| {
        let loader_source_code: Py<PyAny> = match PyModule::from_code_bound(
            py,
            &source_code,
            NBA_MONGO_LOADER_FILE,
            SBS_V1_PYTHON_BACKEND_MODULE
        ) {
            Ok(resp) => resp.into(),
            Err(e) => {
                error!("---------------- unable to load PyModule ----------------: {:?}", e);
                return Err(e);
            }
        };

        match loader_source_code.call_method0(py, NBA_PLAYER_DATA_LOADER_RUNNER_FUNCTION)  {
            Ok(res) => info!("---------------- Success in running run_nba_daily_player_data_loader ----------------: {:?}", res),
            Err(e) => {
                error!("---------------- Failed to run run_nba_daily_player_data_loader ----------------: {:?}", e);
                return Err(e);
            },
        };

        Ok(())
    })
}

#[cfg(feature = "pyo3_required")]
pub async fn load_nba_daily_stats_cache(app_state: AppState, season: u32) -> Result<String, String> {
    let season_types = get_season_types(NBA_SEASON_DATE_MAP.clone(), season);

    let team_stats = match nba_team_aggregated_game_stats_historical_mongo_dao::get_nba_team_agg_game_stats(
        &app_state.nba_team_aggregated_game_stats_historical_collection, 
        None, 
        Some(season), 
        None
    ).await {
        Ok(team_stats) => team_stats,
        Err(e) => { 
            return Err(format!("{:?}", e));
        }
    };

    let team_stats_to_upsert: Vec<NbaTeamStats> = season_types.into_iter()
        .flat_map(|st| {
            let agg_stats_for_season: Vec<NbaTeamAggGameStatsHistorical> = team_stats.to_owned()
                .into_iter()
                .filter(|ts| { ts.season_type == st.to_string() })
                .collect();
            map_nba_team_aggregated_game_stats_to_nba_team_stats(agg_stats_for_season)
        })
        .collect();

    nba_team_stats_mongo_dao::upsert(&app_state.nba_team_stats_collection, team_stats_to_upsert).await
}

#[cfg(feature = "pyo3_required")]
pub fn daily_nba_odds_loader() -> PyResult<()> {
    let source_code = match fs::read_to_string(get_nba_odds_mongo_loader_path()) {
        Ok(code) => {
            info!("---------------- loaded source code! ----------------");
            code
        },
        Err(e) => { 
            error!("---------------- failed to open filed at path ----------------: {:?}", e);
            return Err(e.into());
        }
    };


    Python::with_gil(|py| {
        let loader_source_code: Py<PyAny> = match PyModule::from_code_bound(
            py,
            &source_code,
            NBA_ODDS_MONGO_LOADER_FILE,
            SBS_V1_PYTHON_BACKEND_MODULE
        ) {
            Ok(resp) => resp.into(),
            Err(e) => {
                error!("---------------- unable to load PyModule ----------------: {:?}", e);
                return Err(e);
            }
        };

        match loader_source_code.call_method0(py, NBA_ODDS_LOADER_RUNNER_FUNCTION)  {
            Ok(res) => info!("---------------- Success in running run_nba_odds_daily_loader ----------------: {:?}", res),
            Err(e) => {
                error!("---------------- Failed to run run_nba_odds_daily_loader ----------------: {:?}", e);
                return Err(e);
            },
        };

        Ok(())
    })
}