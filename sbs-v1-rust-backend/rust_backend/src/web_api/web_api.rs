use std::{collections::HashMap, env};
use awc::error::HeaderValue;
use chrono::Utc;
use log::{error, info};
use reqwest::header::{HeaderMap, AUTHORIZATION, CONTENT_TYPE, USER_AGENT};
use scraper::{Html, Selector};
use serde_json::{json, Value};
use crate::{
    models::{
        app_state::get_env, services::{
            get_event_odds_request::GetEventOddsRequest, get_events_request::GetEventsRequest, get_nba_players_by_team_and_season_request::GetNbaPlayersByTeamAndSeasonRequest, get_odds_request::GetOddsRequest, github_api_auth_request::GitHubApiAuthRequest, google_api_auth_request::GoogleApiAuthRequest, login_auth_request::LoginAuthRequest
        }, web_api::web_api_res::WebApiRes
    }, 
    routes::endpoints::{
        NBA_RAPID_API_HOST, NBA_RAPID_API_ROOT, ROTOWIRE_NBA_LINEUPS, THE_ODDS_API_ROOT
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
    
    let env = get_env();
    
    let redirect_uri = if env != "prod" {
        "http://localhost:3000".to_string()
    } else {
        "https://sportsbettingsanbox.com".to_string()
    };

    let body = GoogleApiAuthRequest {
        client_id: google_client_id,
        client_secret: google_client_secret,
        code: req.code.clone(),
        grant_type: "authorization_code".to_string(),
        redirect_uri: redirect_uri
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
    
    let env = get_env();

    let redirect_uri = if env != "prod" {
        "http://localhost:3000/sbs-v1/login".to_string()
    } else {
        "https://sportsbettingsandbox.com/sbs-v1/login".to_string()
    };

    let body = GitHubApiAuthRequest {
        client_id: github_client_id,
        client_secret: github_client_secret,
        code: req.code.to_string(),
        redirect_uri: redirect_uri.to_string()
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
pub async fn get_nba_daily_matchups_from_rotowire() -> WebApiRes {
    match get_rotowire_nba_lineups_response().await {
        Ok(result) => WebApiRes {
            data: Some(result),
            is_error: false,
            error_message: None,
            cached_date_time: Some(Utc::now())
        },
        Err(e) => WebApiRes {
            data: None,
            is_error: true,
            error_message: Some(e.to_string()),
            cached_date_time: None
        }
    }
}

async fn get_rotowire_nba_lineups_response() -> Result<serde_json::Value, reqwest::Error> {
    let resp = reqwest::get(ROTOWIRE_NBA_LINEUPS).await?.text().await?;
    let document = Html::parse_document(&resp);
    
    let team_matchups = get_team_matchups(&document);
    let projected_player_lineups_by_team = get_projected_player_lineups_by_team(&document);
    
    let mut matchups = Vec::new();
    
    for matchup in &team_matchups {
        let away_team = matchup.away.clone();
        let home_team = matchup.home.clone();
        matchups.push(json!({
            "away": {
                "teamNickname": away_team,
                "projectedPlayers": projected_player_lineups_by_team.get(&away_team),
            },
            "home": {
                "teamNickname": home_team,
                "projectedPlayers": projected_player_lineups_by_team.get(&home_team),
            },
        }));
    }
    
    Ok(json!({
        "matchups": matchups,
        "isError": false,
    }))
}

#[derive(Debug)]
struct Matchup {
    away: String,
    home: String,
}
fn get_team_matchups(document: &Html) -> Vec<Matchup> {
    let matchup_selector = Selector::parse("div.lineup__matchup").unwrap();
    let team_selector = Selector::parse("a").unwrap();

    let mut matchups = Vec::new();
    
    for matchup in document.select(&matchup_selector) {
        if matchup.select(&team_selector).any(|a| a.value().attr("class").map_or(false, |c| c.contains("lineup__mteam"))) {
            let home_team_a_tag = matchup
                .select(&team_selector)
                .filter(|a| a.value().attr("class").map_or(false, |c| c.contains("is-home")))
                .next();
            
            let away_team_a_tag = matchup
                .select(&team_selector)
                .filter(|a| a.value().attr("class").map_or(false, |c| c.contains("is-visit")))
                .next();
    
            if let (Some(home), Some(away)) = (home_team_a_tag, away_team_a_tag) {
                let home_team_text: Vec<_> = home.text().collect();
                let away_team_text: Vec<_> = away.text().collect();
                
                let home_team = home_team_text
                    .iter()
                    .filter(|text| !text.trim().is_empty())
                    .map(|text| text.trim())
                    .take(1) // Take only the first meaningful text before any span content
                    .collect::<Vec<_>>()
                    .join(" ");
                
                let away_team = away_team_text
                    .iter()
                    .filter(|text| !text.trim().is_empty())
                    .map(|text| text.trim())
                    .take(1) // Take only the first meaningful text before any span content
                    .collect::<Vec<_>>()
                    .join(" ");
                
                matchups.push(Matchup { away: away_team.to_string(), home: home_team.to_string() });
            }
        }
    }
    
    matchups
}

fn get_projected_player_lineups_by_team(document: &Html) -> HashMap<String, Vec<String>> {
    let button_selector = Selector::parse("button.see-court-on-off").unwrap();
    let player_selector = Selector::parse("li.lineup__player a").unwrap();
    
    let mut players_by_team = HashMap::new();
    
    for button in document.select(&button_selector) {
        if let Some(nickname) = button.value().attr("data-nickname") {
            players_by_team.insert(nickname.to_string(), Vec::new());
            if let Some(player_ids) = button.value().attr("data-lineup") {
                let player_ids: Vec<&str> = player_ids.split(',').collect();
                for player_id in &player_ids[..5] {
                    for player_div in document.select(&player_selector) {
                        if let Some(href) = player_div.value().attr("href") {
                            if href.contains(player_id) {
                                let player_name = player_div.text().collect::<String>().trim().to_string();
                                players_by_team.entry(nickname.to_string()).or_default().push(player_name);
                            }
                        }
                    }
                }
            }
        }
    }
    players_by_team
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
/********************************************************************************/