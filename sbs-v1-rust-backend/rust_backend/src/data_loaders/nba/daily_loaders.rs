#![allow(dead_code)]

use std::fs;
use log::info;
use pyo3::{types::PyModule, Py, PyAny, PyResult, Python};

use crate::models::app_state::AppState;

/** Old loader logic that is already written in python will stay that way. In the future 
 * we should migrate this over to rust but for the sake of prototyping let's keep it in python
 */

// TODO set env variables from bash script to load in
// ENV Variables
// PYO3_PYTHON=$HOME/SBS_V1/sbs-v1-python-backend/venv/bin/python3.13
// PKG_CONFIG_PATH=$HOME/python-shared/lib/pkgconfig:
// RUSTFLAGS=-L$HOME/python-shared/lib -lpython3.13
// PYTHONPATH=$HOME/SBS_V1/sbs-v1-python-backend/venv/lib/python3.13:/Users/smati/SBS_V1/sbs-v1-python-backend/venv/lib/python3.13/site-packages

pub fn daily_nba_game_data_loader() -> PyResult<()> {
    let file_name = "nba_mongo_loaders.py";
    let module_name = "sbs-v1-python-backend";
    let path = format!("../../{}/app/scripts/{}", module_name, file_name);
    
    let source_code = match fs::read_to_string(path) {
        Ok(code) => {
            info!("loaded source code:{}", code);
            code
        },
        Err(e) => { 
            info!("failed to open filed at path: {:?}", e);
            return Ok(());
        }
    };

    Python::with_gil(|py| {
        let loader_source_code: Py<PyAny> = match PyModule::from_code_bound(
            py,
            &source_code,
            &file_name,
            &module_name
        ) {
            Ok(resp) => resp.into(),
            Err(e) => {
                info!("Unable to load PyModule: {:?}", e);
                return Ok(());
            }
        };

        match loader_source_code.call_method0(py, "run_nba_daily_games_data_loader")  {
            Ok(res) => info!("Success in running run_nba_daily_games_data_loader: {:?}", res),
            Err(e) => info!("Failed to run run_nba_daily_games_data_loader: {:?}", e),
        };

        Ok(())
    })
}

pub async fn daily_nba_player_game_data_loader(_app_state: AppState) {

}