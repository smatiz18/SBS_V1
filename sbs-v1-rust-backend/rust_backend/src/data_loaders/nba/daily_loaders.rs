#![allow(dead_code)]

use std::fs;
use log::{error, info};
use pyo3::{types::PyModule, Py, PyAny, PyResult, Python};
use crate::constants::python_script_paths::{get_nba_mongo_loader_path, NBA_GAME_DATA_LOADER_RUNNER_FUNCTION, NBA_MONGO_LOADER_FILE, NBA_PLAYER_DATA_LOADER_RUNNER_FUNCTION, SBS_V1_PYTHON_BACKEND_MODULE};

/** Old loader logic that is already written in python will stay that way. In the future 
 * we should migrate this over to rust but for the sake of prototyping let's keep it in python
 */

// remember to set env variables
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