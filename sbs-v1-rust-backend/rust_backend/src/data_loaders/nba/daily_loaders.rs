#![allow(dead_code)]

use std::fs;

use pyo3::prelude::*;
use pyo3::types::PyTuple;

use crate::models::app_state::AppState;

/** Old loader logic that is already written in python will stay that way. In the future 
 * we should migrate this over to rust but for the sake of prototyping let's keep it in python
 */

pub fn daily_nba_game_data_loader() -> PyResult<()> {
    let file_name = "nba_mongo_loaders.py";
    let module_name = "sbs-v1-python-backend";
    let path = format!("../../{}/app/scripts/{}", module_name, file_name);
    
    let source_code = match fs::read_to_string(path) {
        Ok(code) => code,
        Err(e) => { 
            print!("failed to open filed at path: {:?}", e);
            return Ok(());
        }
    };

    Python::with_gil(|py| {
        let loader_source_code: Py<PyAny> = PyModule::from_code_bound(
            py,
            &source_code,
            &file_name,
            &module_name
        )?
        .into();


        match loader_source_code.call_method0(py, "run_nba_daily_games_data_loader")  {
            Ok(res) => print!("Success in running run_nba_daily_games_data_loader: {:?}", res),
            Err(e) => print!("Failed to run run_nba_daily_games_data_loader: {:?}", e)
        }
        
        Ok(())
    })
}

pub async fn daily_nba_player_game_data_loader(_app_state: AppState) {

}