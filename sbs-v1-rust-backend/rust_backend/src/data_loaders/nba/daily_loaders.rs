#![allow(dead_code)]

use std::fs;
use log::{error, info};
use pyo3::{types::PyModule, Py, PyAny, PyResult, Python};
use crate::constants::python_script_paths::{get_nba_mongo_loader_path, NBA_MONGO_LOADER_FILE, SBS_V1_PYTHON_BACKEND_MODULE};

/** Old loader logic that is already written in python will stay that way. In the future 
 * we should migrate this over to rust but for the sake of prototyping let's keep it in python
 */

// TODO set env variables from bash script to load in
// ENV Variables
// export PYO3_PYTHON=$HOME/projects/SBS_V1/sbs-v1-python-backend/venv/bin/python3.13
// export PKG_CONFIG_PATH=$HOME/python-shared/lib/pkgconfig:
// export RUSTFLAGS="-L$HOME/python-shared/lib -lpython3.13"
// export PYTHONPATH=$HOME/projects/SBS_V1/sbs-v1-python-backend/venv/lib/python3.13:$HOME/projects/SBS_V1/sbs-v1-python-backend/venv/lib/python3.13/site-packages

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
                return Ok(());
            }
        };

        match loader_source_code.call_method0(py, "run_nba_daily_games_data_loader")  {
            Ok(res) => info!("---------------- Success in running run_nba_daily_games_data_loader ----------------: {:?}", res),
            Err(e) => error!("---------------- Failed to run run_nba_daily_games_data_loader ----------------: {:?}", e),
        };

        Ok(())
    })
}

pub async fn daily_nba_player_game_data_loader() {

}