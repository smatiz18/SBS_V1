use std::fs;

use log::{info, error};
use pyo3::{types::PyModule, Py, PyAny, Python};
use crate::{constants::python_script_paths::{GET_NBA_MATCHUPS_FILE, GET_NBA_MATCHUPS_FUNCTION, SBS_V1_PYTHON_BACKEND_MODULE}, models::web_api::web_api_res::WebApiRes};

fn get_nba_daily_matchups_path() -> String {
    format!("../../{}/app/services/rotowire/{}", SBS_V1_PYTHON_BACKEND_MODULE, GET_NBA_MATCHUPS_FILE)
}

pub fn get_nba_daily_matchups_from_python() -> WebApiRes {
    let source_code = match fs::read_to_string(&get_nba_daily_matchups_path()) {
        Ok(code) => {
            info!("---------------- loaded source code! ----------------");
            code
        },
        Err(e) => { 
            error!("---------------- failed to open filed at path ----------------: {:?}", e);
            return WebApiRes {
                is_error: Some(true),
                error_message: Some(e.to_string()),
                data: None
            };
        }
    };


    let res = Python::with_gil(|py| {
        let loader_source_code: Py<PyAny> = match PyModule::from_code_bound(
            py,
            &source_code,
            GET_NBA_MATCHUPS_FILE,
            SBS_V1_PYTHON_BACKEND_MODULE
        ) {
            Ok(resp) => resp.into(),
            Err(e) => {
                error!("---------------- unable to load PyModule ----------------: {:?}", e);
                return Err(e);
            }
        };

        match loader_source_code.call_method0(py, GET_NBA_MATCHUPS_FUNCTION)  {
            Ok(res) => {

                let contents: String = res.extract(py)?;

                match serde_json::to_value(contents) {
                    Ok(v) => Ok(
                        WebApiRes {
                            is_error: Some(false),
                            error_message: None,
                            data: Some(v)
                        }
                    ),
                    Err(e) => {
                        error!("unable to parse result! {:?}", e);
                        Ok(
                            WebApiRes {
                                is_error: Some(true),
                                error_message: Some(e.to_string()),
                                data: None 
                            }
                        )
                    }
                }
            },
            Err(e) => {
                error!("unable to call method {:?}", GET_NBA_MATCHUPS_FUNCTION);
                Ok(
                    WebApiRes {
                        is_error: Some(true),
                        error_message: Some(e.to_string()),
                        data: None 
                    }
                )
            },
        }
    });

    match res {
        Ok(web_api_res) => web_api_res,
        Err(e) => WebApiRes {
            is_error: Some(true),
            error_message: Some(e.to_string()),
            data: None
        }
    }
}
