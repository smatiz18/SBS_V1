use std::{env, fs};
use awc::error::HeaderValue;
use chrono::Utc;
use log::{error, info};
use pyo3::{types::PyModule, Py, PyAny, Python};
use reqwest::header::{HeaderMap, AUTHORIZATION, CONTENT_TYPE, USER_AGENT};
use serde_json::{json, Value};
use crate::{
    constants::python_script_paths::{
        GET_NBA_MATCHUPS_FILE, 
        GET_NBA_MATCHUPS_FUNCTION, 
        SBS_V1_PYTHON_BACKEND_MODULE
    }, 
    models::{
        services::{
            get_event_odds_request::GetEventOddsRequest, get_events_request::GetEventsRequest, get_nba_players_by_team_and_season_request::GetNbaPlayersByTeamAndSeasonRequest, get_odds_request::GetOddsRequest, github_api_auth_request::GitHubApiAuthRequest, google_api_auth_request::GoogleApiAuthRequest, login_auth_request::LoginAuthRequest
        }, 
        web_api::web_api_res::WebApiRes
    }, 
    routes::endpoints::{
        NBA_RAPID_API_HOST, 
        NBA_RAPID_API_ROOT, 
        THE_ODDS_API_ROOT
    }
};

/** rapid api *******************************************************************/
/********************************************************************************/
pub async fn get_nba_players_by_team_and_season_rapid_api(req: GetNbaPlayersByTeamAndSeasonRequest) -> WebApiRes {
    let url = format!("{}/players?team={}&season={}", NBA_RAPID_API_ROOT, &req.team_id, &req.season); 
    let rapid_api_key = env::var("RAPID_API_KEY").expect("You must set RAPID_API_KEY environment var!");
    let mut headers = HeaderMap::new();
    headers.insert(
        "x-rapidapi-host", 
        HeaderValue::from_static(NBA_RAPID_API_HOST)
    );
    headers.insert(
        "x-rapidapi-key",
        HeaderValue::from_str(&rapid_api_key).expect("You must set RAPID_API_KEY environment var!")
    );

    get(&url, headers).await
}
/********************************************************************************/

/** odds api ********************************************************************/
/********************************************************************************/
pub async fn get_events_odds_api(req: GetEventsRequest) -> WebApiRes {
    let odds_api_key = env::var("ODDS_API_KEY").expect("You must set ODDS_API_KEY environment var!");

    let url = format!(
        "{}sports/{}/events?apiKey={}",
        THE_ODDS_API_ROOT, 
        req.sports.to_string(), 
        odds_api_key
    );

    get(&url, HeaderMap::new()).await
}

pub async fn get_odds_odds_api(req: GetOddsRequest) -> WebApiRes {
    let odds_api_key = env::var("ODDS_API_KEY").expect("You must set ODDS_API_KEY environment var!");

    let markets: String = req.markets.join(",");
    
    let bookmakers = req.bookmakers
        .to_owned()
        .into_iter()
        .map(|bookmaker | bookmaker.to_string())
        .collect::<Vec<String>>()
        .join(",");

    let url = format!(
        "{}sports/{}/odds/?apiKey={}&regions={}&markets={}&oddsFormat={}&bookmakers={}", 
        THE_ODDS_API_ROOT, 
        req.sports.to_string(), 
        odds_api_key, 
        req.regions.to_string(), 
        markets, 
        req.odds_format,
        bookmakers
    );

    get(&url, HeaderMap::new()).await
}

pub async fn get_event_odds_odds_api(req: GetEventOddsRequest) -> WebApiRes {
    let odds_api_key = env::var("ODDS_API_KEY").expect("You must set ODDS_API_KEY environment var!");

    let markets: String = req.markets.join(",");
    
    let bookmakers = req.bookmakers
        .to_owned()
        .into_iter()
        .map(|bookmaker | bookmaker.to_string())
        .collect::<Vec<String>>()
        .join(",");

    let url = format!(
        "{}sports/{}/events/{}/odds?apiKey={}&regions={}&markets={}&oddsFormat={}&bookmakers={}", 
        THE_ODDS_API_ROOT, 
        req.sports.to_string(), 
        req.event_id.to_string(),
        odds_api_key, 
        req.regions.to_string(), 
        markets, 
        req.odds_format,
        bookmakers
    );

    info!("URL: {:?}", url);

    get(&url, HeaderMap::new()).await
}
/********************************************************************************/

/** google api ******************************************************************/
/********************************************************************************/
pub async fn authenticate_google_token(req: LoginAuthRequest) -> WebApiRes {
    let url = "https://oauth2.googleapis.com/token";
    let google_client_id = env::var("SBS_GOOGLE_LOGIN_CLIENT_ID")
        .expect("You must set the SBS_GOOGLE_LOGIN_CLIENT_ID environment var!");
    let google_client_secret = env::var("SBS_GOOGLE_LOGIN_CLIENT_SECRET")
        .expect("You must set the SBS_GOOGLE_LOGIN_CLIENT_SECRET environment var!");
    let redirect_uri_local = "http://localhost:3000".to_string();

    let body = GoogleApiAuthRequest {
        client_id: google_client_id,
        client_secret: google_client_secret,
        code: req.code.clone(),
        grant_type: "authorization_code".to_string(),
        redirect_uri: redirect_uri_local
    };

    let client = reqwest::Client::new();
    match client
        .post(url)
        .form(&body)
        .header(CONTENT_TYPE, "application/x-www-form-urlencoded")
        .send()
        .await {
            Ok(res) => {
                match res.json::<Value>().await {
                    Ok(r) => {
                        WebApiRes {
                            is_error: false,
                            error_message: None,
                            data: Some(r),
                            cached_date_time: Some(Utc::now())
                        }
                    },
                    Err(e) => {
                        error!("Failed to parse response: {:?}", e);
                        WebApiRes {
                            is_error: true,
                            error_message: Some(e.to_string()),
                            data: None,
                            cached_date_time: None
                        }
                    }
                }
            },
            Err(e) => {
                error!("Failed to authenticate code: {:?}", e);
                WebApiRes {
                    is_error: true,
                    error_message: Some(e.to_string()),
                    data: None,
                    cached_date_time: None
                }
            }
        }
}

pub async fn get_google_user_info(access_token: String) -> WebApiRes {
    let url = "https://www.googleapis.com/oauth2/v2/userinfo";
    let mut headers = HeaderMap::new();
    let header_val = format!("Bearer {}", access_token);
    
    headers.insert(
        AUTHORIZATION, 
        HeaderValue::from_str(&header_val).expect("access_token")
    );
    
    get(url, headers).await
}
/********************************************************************************/

/** github api ******************************************************************/
/********************************************************************************/
pub async fn authenticate_github_token(req: LoginAuthRequest) -> WebApiRes {
    let url = "https://github.com/login/oauth/access_token";
    let github_client_id = env::var("SBS_GITHUB_LOGIN_CLIENT_ID")
        .expect("You must set the SBS_GITHUB_LOGIN_CLIENT_ID environment var!");
    let github_client_secret = env::var("SBS_GITHUB_LOGIN_CLIENT_SECRET")
        .expect("You must set the SBS_GITHUB_LOGIN_CLIENT_SECRET environment var!");
    let redirect_uri_local = "http://localhost:3000/sbs-v1/login".to_string();

    let body = GitHubApiAuthRequest {
        client_id: github_client_id,
        client_secret: github_client_secret,
        code: req.code.to_string(),
        redirect_uri: redirect_uri_local.to_string()
    };

    let client = reqwest::Client::new();
    match client
        .post(url)
        .json(&body)
        .send()
        .await {
            Ok(res) => {
                match res.text().await {
                    Ok(r) => {
                        let data = serde_json::to_value::<Value>(
                            serde_urlencoded::from_str(&r).unwrap()
                        ).unwrap();
                        WebApiRes {
                            is_error: false,
                            error_message: None,
                            data: Some(data),
                            cached_date_time: Some(Utc::now())
                        }
                    },
                    Err(e) => {
                        error!("Failed to parse response: {:?}", e);
                        WebApiRes {
                            is_error: true,
                            error_message: Some(e.to_string()),
                            data: None,
                            cached_date_time: None
                        } 
                    }
                }
            },
            Err(e) => {
                error!("Failed to authenticate code: {:?}", e);
                WebApiRes {
                    is_error: true,
                    error_message: Some(e.to_string()),
                    data: None,
                    cached_date_time: None
                }           
            }
        }
}

pub async fn get_github_user_info(access_token: String) -> WebApiRes {
    let url = "https://api.github.com/user";
    let mut headers = HeaderMap::new();
    let header_val = format!("Bearer {}", access_token);
    
    headers.insert(
        AUTHORIZATION, 
        HeaderValue::from_str(&header_val).expect("access_token")
    );
    headers.insert(
        USER_AGENT,
        HeaderValue::from_static("reqwest")
    );
    
    get(url, headers).await
}

pub async fn get_github_user_email_info(access_token: String) -> WebApiRes {
    let url = "https://api.github.com/user/emails";
    let mut headers: HeaderMap = HeaderMap::new();
    let header_val = format!("Bearer {}", access_token);

    headers.insert(
        AUTHORIZATION, 
        HeaderValue::from_str(&header_val).expect("access_token")
    );
    headers.insert(
        USER_AGENT,
        HeaderValue::from_static("reqwest")
    );

    get(url, headers).await
}

/********************************************************************************/

/** rotowire ********************************************************************/
/********************************************************************************/
pub fn get_nba_daily_matchups_from_rotowire() -> WebApiRes {
    let source_code = match fs::read_to_string(&get_nba_daily_matchups_path()) {
        Ok(code) => {
            info!("---------------- loaded source code! ----------------");
            code
        },
        Err(e) => { 
            error!("---------------- failed to open filed at path ----------------: {:?}", e);
            return WebApiRes {
                is_error: true,
                error_message: Some(e.to_string()),
                data: None,
                cached_date_time: None
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
                            is_error: false,
                            error_message: None,
                            data: Some(v),
                            cached_date_time: Some(Utc::now())
                        }
                    ),
                    Err(e) => {
                        error!("unable to parse result! {:?}", e);
                        Ok(
                            WebApiRes {
                                is_error: true,
                                error_message: Some(e.to_string()),
                                data: None,
                                cached_date_time: None
                            }
                        )
                    }
                }
            },
            Err(e) => {
                error!("unable to call method {:?}", GET_NBA_MATCHUPS_FUNCTION);
                Ok(
                    WebApiRes {
                        is_error: true,
                        error_message: Some(e.to_string()),
                        data: None,
                        cached_date_time: None
                    }
                )
            },
        }
    });

    match res {
        Ok(web_api_res) => web_api_res,
        Err(e) => WebApiRes {
            is_error: true,
            error_message: Some(e.to_string()),
            data: None,
            cached_date_time: None
        }
    }
}
/********************************************************************************/

/** util ************************************************************************/
/********************************************************************************/
async fn get(url: &str, headers: HeaderMap) -> WebApiRes {
    let client: reqwest::Client = reqwest::Client::new();
    let cached_date_time = Utc::now();
    match client.get(url.to_owned())
        .headers(headers)
        .send()
        .await {
            Ok(r) => {
                WebApiRes {
                    is_error: false,
                    error_message: None,
                    data: Some(r.json::<Value>().await.unwrap_or(json!({ "err": "err" }))),
                    cached_date_time: Some(cached_date_time)
                }
            },
            Err(e) => {
                error!("Failed to fetch data: {:?}", e); 
                WebApiRes {
                    is_error: true,
                    error_message: Some(e.to_string()),
                    data: None,
                    cached_date_time: Some(cached_date_time)
                }
            }
        }
}

fn get_nba_daily_matchups_path() -> String {
    format!("../../{}/app/services/rotowire/{}", SBS_V1_PYTHON_BACKEND_MODULE, GET_NBA_MATCHUPS_FILE)
}
/********************************************************************************/