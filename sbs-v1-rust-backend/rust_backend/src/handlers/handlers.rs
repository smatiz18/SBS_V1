use actix_web::{ web, HttpResponse, Responder};
use bson::Document;
use serde::Serialize;
use serde_json::{json, Value};
use urlencoding::encode;
use crate::aggregators::nba_feature_map_aggregators::get_nba_backtest_feature_map;
use crate::aggregators::optimal_odds_aggregators::get_optimal_odds_by_event_map;
use crate::db::base_mongo::aggregate;
use crate::models::enums::sports_categories::SportsCategories;
use crate::models::odds::odds::Event;
use crate::models::services::execute_mongo_query_request::ExecuteMongoQueryRequest;
use crate::models::services::get_backtest_feature_map_request::BacktestFeatureMapRequest;
use crate::models::services::get_nba_team_agg_game_stats_request::GetNbaTeamAggGameStatsRquest;
use crate::models::services::get_nba_games_by_team_and_season_request::GetNbaGamesByTeamAndSeasonRequest;
use crate::models::services::get_nba_odds_by_team_and_season_request::GetNbaOddsByTeamAndSeasonRequest;
use crate::models::services::get_nba_players_by_team_and_season_request::GetNbaPlayersByTeamAndSeasonRequest;
use crate::models::services::get_nba_players_by_team_and_season_response::GetNbaPlayersByTeamAndSeasonResponse;
use crate::models::services::get_nba_player_stats_by_id_and_season_request::GetNbaPlayerStatsByIdAndSeasonRequest;
use crate::models::services::get_nba_team_stats_request::GetNbaTeamStatsRequest;
use crate::models::services::get_odds_request::GetOddsRequest;
use crate::models::services::get_odds_response::GetOddsResponse;
use crate::models::services::login_auth_request::LoginAuthRequest;
use crate::routes::endpoints::{NBA_RAPID_API_HOST, NBA_RAPID_API_ROOT, THE_ODDS_API_ROOT};
use reqwest::header::{HeaderMap, HeaderValue};
use std::env;
use log::{info, error};

use crate::models::app_state::AppState;
use crate::db::{nba_games_historical_mongo_dao, nba_odds_historical_mongo_dao, nba_player_aggregated_game_stats_historical_mongo_dao, nba_team_aggregated_game_stats_historical_mongo_dao, nba_team_stats_mongo_dao};

/** mongo handlers **************************************************************/
/********************************************************************************/
pub async fn get_nba_games_by_team_and_season(
    app_state: web::Data<AppState>, 
    req: web::Query<GetNbaGamesByTeamAndSeasonRequest>
) -> impl Responder {
    info!("Recieved req for nba_historical_game_req teamId: {}, season: {}", req.team_id, req.season);
    let objs_result = nba_games_historical_mongo_dao::get_nba_games_by_team_and_season(
        &app_state.as_ref().nba_games_historical_collection, 
        req.team_id, 
        req.season
    ).await; 

    match objs_result {
        Ok(objs) => {
            info!("Returned {} docs from mongo", objs.len());
            HttpResponse::Ok().json(objs)
        },
        Err(e) => {
            error!("Failed to get nba games by teams and season: {:?}", e);
            HttpResponse::InternalServerError().body(format!("{:?}", e))
        }
    }
}

pub async fn get_nba_odds_by_team_and_season(
    app_state: web::Data<AppState>, 
    req: web::Query<GetNbaOddsByTeamAndSeasonRequest>
) -> impl Responder {
    info!("Recieved req for nba_historical_odds_req team: {}, season: {}", req.team_name, req.season);
    let objs_result = nba_odds_historical_mongo_dao::get_nba_odds_by_team_and_season(
        &app_state.as_ref().nba_odds_historical_collection, 
        &req.team_name,
        req.season
    ).await; 

    match objs_result {
        Ok(objs) => {
            info!("Returned {} docs from mongo", objs.len());
            HttpResponse::Ok().json(objs)
        },
        Err(e) => {
            error!("Failed to get nba odds by teams and season: {:?}", e);
            HttpResponse::InternalServerError().body(format!("{:?}", e))
        }
    }
}

pub async fn get_nba_player_stats_by_id_and_season(
    app_state: web::Data<AppState>, 
    req: web::Query<GetNbaPlayerStatsByIdAndSeasonRequest>
) -> impl Responder {
    info!("Recieved req for get_nba_player_stats_by_id_and_season id: {}, season: {}", req.player_id, req.season);
    let objs_result = nba_player_aggregated_game_stats_historical_mongo_dao::get_nba_agg_player_stats_by_id_and_season(
        &app_state.as_ref().nba_player_aggregated_game_stats_historical_collection, 
        req.player_id,
        &req.season,
        None
    ).await; 

    match objs_result {
        Ok(objs) => {
            info!("Returned {} docs from mongo", objs.len());
            HttpResponse::Ok().json(objs)
        },
        Err(e) => {
            error!("Failed to get nba odds by teams and season: {:?}", e);
            HttpResponse::InternalServerError().body(format!("{:?}", e))
        }
    }
}

pub async fn get_feature_map_for_backtest(
    app_state: web::Data<AppState>, 
    req: web::Json<BacktestFeatureMapRequest>
) -> impl Responder {
    info!("Recieved req for feature map request!");
    match req.sports_category {
        SportsCategories::NBA => 
            HttpResponse::Ok()
                .json(get_nba_backtest_feature_map(app_state.get_ref().clone(), req.into_inner()).await),
        _ => HttpResponse::Ok().body("Test!")
    }
}

pub async fn get_nba_team_agg_game_stats(
    app_state: web::Data<AppState>,
    req: web::Json<GetNbaTeamAggGameStatsRquest>
) -> impl Responder {
    info!("Recieved req for get_nba_game_stats_avg_response");
    let objs_result = nba_team_aggregated_game_stats_historical_mongo_dao::get_nba_team_agg_game_stats(
        &app_state.nba_team_aggregated_game_stats_historical_collection, 
        Some(req.team_ids.to_owned()), 
        Some(req.season), 
        req.season_type.to_owned()
    ).await;

    match objs_result {
        Ok(objs) => {
            info!("Returned {} docs from mongo", objs.len());
            HttpResponse::Ok().json(objs)
        },
        Err(e) => {
            error!("Failed to get nba stats avgs: {:?}", e);
            HttpResponse::InternalServerError().body(format!("{:?}", e))
        }
    }
}

pub async fn get_nba_team_stats(
    app_state: web::Data<AppState>,
    req: web::Json<GetNbaTeamStatsRequest>
) -> impl Responder {
    info!("Recieved req for get_nba_team_stats {:?}" , req);

    match nba_team_stats_mongo_dao::get_nba_team_stats(
        &app_state.nba_team_stats_collection, 
        req.team_ids.clone(), 
        req.season, 
        req.season_type.clone()
    ).await {
        Ok(team_stats) => {
            info!("Returned {} docs from mongo", team_stats.len());
            HttpResponse::Ok().json(team_stats)
        },
        Err(e) => {
            error!("Failed to fetch data: {:?}", e);
            HttpResponse::InternalServerError().body("Failed to fetch data")
        }
    }
}

pub async fn execute_aggregation_query(
    app_state: web::Data<AppState>,
    req: web::Json<ExecuteMongoQueryRequest>,
) -> Result<HttpResponse, actix_web::Error> {
    // Get the collection
    let collection = app_state
        .get_collection(&req.collection_name)
        .ok_or_else(|| {
            error!("Mongo collection does not exist");
            actix_web::error::ErrorInternalServerError("Mongo collection does not exist")
        })?;

    // Convert the aggregation pipeline into BSON documents
    let agg_pipeline_as_docs: Vec<Document> = req
        .aggregation_pipeline
        .to_owned()
        .into_iter()
        .map(|mongo_agg| {
            let json_value: Value = serde_json::from_str(&mongo_agg)
                .map_err(|e| actix_web::error::ErrorBadRequest(format!("Invalid JSON: {}", e)))?;
            bson::from_bson(bson::to_bson(&json_value).map_err(|e| {
                actix_web::error::ErrorBadRequest(format!("Failed to convert to BSON: {}", e))
            })?)
            .map_err(|e| {
                actix_web::error::ErrorInternalServerError(format!("Failed to parse BSON: {}", e))
            })
        })
        .collect::<Result<_, actix_web::Error>>()?; // Explicitly propagate errors

    // Execute the aggregation query
    let docs = aggregate(&collection, agg_pipeline_as_docs, None)
        .await
        .map_err(|e| {
            error!("Failed to fetch data: {:?}", e);
            actix_web::error::ErrorInternalServerError("Failed to fetch data")
        })?;

    // Log the result and return the response
    info!("Returned {} docs from MongoDB", docs.len());
    Ok(HttpResponse::Ok().json(docs))
}
/********************************************************************************/



/** web api handlers ************************************************************/
/********************************************************************************/

/** Rapid API */
pub async fn get_nba_players_by_team_and_season(
    _app_state: web::Data<AppState>,
    req: web::Query<GetNbaPlayersByTeamAndSeasonRequest> 
) -> impl Responder {
    info!("Recieved req for get_nba_players_by_team_and_season, teamId {}, season: {}", req.team_id, req.season);
    let client = reqwest::Client::new();
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

    match client
        .get(url.to_owned())
        .headers(headers)
        .send()
        .await {
            Ok(response) => {
                match response.json::<GetNbaPlayersByTeamAndSeasonResponse>().await {
                    Ok(resp_obj) => {
                        info!("Returned resp from {}", url.clone());
                        HttpResponse::Ok().json(resp_obj)
                    },
                    Err(e) => {
                        error!("Failed to parse response: {:?}", e);
                        HttpResponse::InternalServerError().body(format!("{:?}", e))
                    },
                }
            },
            Err(e) => {
                error!("Failed to fetch data: {:?}", e);
                HttpResponse::InternalServerError().body("Failed to fetch data")
            },
        }
}

/** Odds API */
// TODO build caching system where it does not re-call the odds api if last recent call was under 15 minutes
pub async fn get_odds(
    _app_state: web::Data<AppState>,
    req: web::Json<GetOddsRequest>
) -> impl Responder {
    info!("Recieved req for get_odds() req: {:?}", req);
    let client = reqwest::Client::new();
    
    let odds_api_key = env::var("ODDS_API_KEY").expect("You must set ODDS_API_KEY environment var!");

    let markets: String = req.markets
        .to_owned()
        .into_iter()
        .map(|market| market.clone().to_string())
        .collect::<Vec<String>>()
        .join(",");
    
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

    match client.get(url.to_owned())
        .send()
        .await {
            Ok(response) =>
                match response.json::<Vec<Event>>().await { 
                    Ok(events) => {
                        info!("Returned resp from {}", url.clone());

                        let resp_obj = GetOddsResponse {
                            events: events.clone(),
                            optimal_odds_map: get_optimal_odds_by_event_map(events.clone()),
                        };
                        HttpResponse::Ok().json(resp_obj)
                    },
                    Err(e) => {
                        error!("Failed to parse response: {:?}", e);
                        HttpResponse::InternalServerError().body(format!("{:?}", e))
                    },
                },
            Err(e) =>  {
                error!("Failed to fetch data: {:?}", e);
                HttpResponse::InternalServerError().body(format!("{:?}", e))
            }
        }
}
/********************************************************************************/

/** env var handlers ************************************************************/
/********************************************************************************/
pub async fn get_ui_login_credentials() -> impl Responder {
    let google_client_id = env::var("SBS_GOOGLE_LOGIN_CLIENT_ID")
        .expect("You must set the SBS_GOOGLE_LOGIN_CLIENT_ID environment var!");
    let github_client_id = env::var("SBS_GITHUB_LOGIN_CLIENT_ID")
        .expect("You must set the SBS_GITHUB_LOGIN_CLIENT_ID environment var!");
   
    #[derive(Serialize, Debug, Clone)]
    #[serde(rename_all = "camelCase")]
    struct UiLoginCredentials {
        google_client_id: String,
        github_client_id: String,
    }

    HttpResponse::Ok().json(UiLoginCredentials {
        google_client_id: google_client_id,
        github_client_id: github_client_id,
    })
}

pub async fn get_google_auth(
    _app_state: web::Data<AppState>,
    req: web::Json<LoginAuthRequest>
) -> impl Responder {
    let client = reqwest::Client::new();
    let url = "https://oauth2.googleapis.com/token";
    let google_client_id = env::var("SBS_GOOGLE_LOGIN_CLIENT_ID")
        .expect("You must set the SBS_GOOGLE_LOGIN_CLIENT_ID environment var!");
    let google_client_secret = env::var("SBS_GOOGLE_LOGIN_CLIENT_SECRET")
        .expect("You must set the SBS_GOOGLE_LOGIN_CLIENT_SECRET environment var!");
    let redirect_uri_local = encode("http://localhost:3000/sbs-v1/about").into_owned();

    let body = json!({
        "client_id": google_client_id,
        "client_secret": google_client_secret,
        "code": req.code,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri_local
    });

    match client
        .post(url)
        .json(&body)
        .send()
        .await {
            Ok(res) => {
                match res.json::<Value>().await {
                    Ok(r) => HttpResponse::Ok().json(r),
                    Err(e) => {
                        error!("Failed to fetch data: {:?}", e);
                        HttpResponse::InternalServerError().body(format!("{:?}", e))
                    }
                }
            },
            Err(e) => {
                error!("Failed to fetch data: {:?}", e);
                HttpResponse::InternalServerError().body(format!("{:?}", e))
            }

        }
}
/********************************************************************************/

pub async fn test() -> HttpResponse {
    HttpResponse::Ok().body("Test!")
}