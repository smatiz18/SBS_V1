use actix_web::{ web, HttpResponse, Responder};
use bson::Document;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use crate::aggregators::nba_feature_map_aggregators::get_nba_backtest_feature_map;
use crate::db::base_mongo::aggregate;
use crate::db::user_info_mongo_dao::handle_user_login;
use crate::models::db::user_info::{LoginSource, UserInfo};
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
use crate::models::services::login_auth_request::LoginAuthRequest;
use crate::web_api::web_api::{authenticate_github_token, authenticate_google_token, get_github_user_email_info, get_github_user_info, get_google_user_info, get_nba_players_by_team_and_season_rapid_api, get_odds_odds_api};
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
    let web_api_res = get_nba_players_by_team_and_season_rapid_api(req.into_inner()).await;
    if web_api_res.data.is_some() {
        match serde_json::from_value::<GetNbaPlayersByTeamAndSeasonResponse>(web_api_res.data.unwrap()) {
            Ok(resp_obj) => {
                info!("Returned players by team and season from rapid api");
                HttpResponse::Ok().json(resp_obj)
            },
            Err(e) => {
                error!("Failed to parse response: {:?}", e);
                HttpResponse::InternalServerError().body(format!("{:?}", e))
            },
        }
    } else {
        HttpResponse::InternalServerError().body(
            format!("Failed to fetch data {:?}", web_api_res.error_message.unwrap_or("error".to_string()))
        )
    }
}

/** Odds API */
pub async fn get_odds(
    _app_state: web::Data<AppState>,
    req: web::Json<GetOddsRequest>
) -> impl Responder {
    info!("Recieved req for get_odds, bookmakers: {:?}, sports: {:?}", req.bookmakers, req.sports);
    let web_api_res = get_odds_odds_api(req.into_inner()).await;
    if web_api_res.data.is_some() {
        match serde_json::from_value::<Event>(web_api_res.data.unwrap()) {
            Ok(resp_obj) => {
                info!("Returned odds from odds api");
                HttpResponse::Ok().json(resp_obj)
            },
            Err(e) => {
                error!("Failed to parse response: {:?}", e);
                HttpResponse::InternalServerError().body(format!("{:?}", e))
            }
        }
    } else {
        HttpResponse::InternalServerError().body(
            format!("Failed to fetch data {:?}", web_api_res.error_message.unwrap_or("error".to_string()))
        )
    }
}
/********************************************************************************/

/** credentials handlers ********************************************************/
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
    app_state: web::Data<AppState>,
    req: web::Json<LoginAuthRequest>
) -> impl Responder {
    info!("Recieved req for google user login!");
    
    let authentication_res = authenticate_google_token(req.into_inner()).await;

    if authentication_res.data.is_some() {
        let auth_data = authentication_res.data.unwrap();
        let access_token = auth_data.get("access_token").expect("access_token");
        let web_api_res = get_google_user_info(
            access_token.as_str().expect("access_token").to_string()
        ).await;
    
        #[derive(Serialize, Deserialize, Clone, Debug)]
        struct GoogleUserInfo {
            email: String,
            family_name: String,
            given_name: String,
            id: String,
            name: String,
            picture: String,
            verified_email: bool
        }
    
        if web_api_res.data.is_some() {
            let google_user_info: GoogleUserInfo = serde_json::from_value(
                web_api_res.data.clone().unwrap()
            ).unwrap();
    
            let user_info_obj = UserInfo {
                _id: google_user_info.email.clone(),
                email: google_user_info.email,
                username: None,
                firstname: Some(google_user_info.given_name),
                lastname: Some(google_user_info.family_name),
                is_premium_user: None,
                member_since: None,
                last_login: None,
                number_of_logins: None,
                login_source: LoginSource::Gmail
            };
            return match handle_user_login(&app_state.user_info_collection, user_info_obj).await {
                Ok(res) => {
                    HttpResponse::Ok().json(res)
                },
                Err(e) => {
                    error!("unable to login user!");
                    HttpResponse::InternalServerError().body(format!("{:?}", e))
                }
            };
        } else {
            error!("unable to authenticate user!");
            return HttpResponse::InternalServerError().body(
                format!("{:?}", authentication_res.error_message.unwrap_or("error".to_string()))
            );
        }
    } else {
        HttpResponse::InternalServerError().body("Unable login user!")
    }
}

pub async fn get_github_auth(
    app_state: web::Data<AppState>,
    req: web::Json<LoginAuthRequest>
) -> impl Responder {
    info!("Recieved req for github user login!");
    
    let web_api_res = authenticate_github_token(req.into_inner()).await;
    
    if web_api_res.data.is_some() {
        let data = web_api_res.data.unwrap();
        let access_token = data.get("access_token")
            .expect("access_token");
    
        #[derive(Serialize, Deserialize, Clone, Debug)]
        struct GitHubUserInfo {
            bio: Option<String>,
            name: Option<String>,
            login: Option<String>    
        }
        let user_info = get_github_user_info(
            access_token.as_str().expect("access_token").to_string()
        ).await;

        #[derive(Serialize, Deserialize, Clone, Debug)]
        struct GitHubEmailInfo {
            email: String,
            primary: bool,
            verified: bool
        }
        let user_email = get_github_user_email_info(
            access_token.as_str().expect("access_token").to_string()
        ).await;

        match (user_info.data, user_email.data) {
            (Some(u_i), Some(u_e)) => {
                let u_i_obj_res = serde_json::from_value::<GitHubUserInfo>(u_i);
                let u_e_obj_res = serde_json::from_value::<Vec<GitHubEmailInfo>>(u_e);

                match (u_i_obj_res, u_e_obj_res) {
                    (Ok(u_i_obj), Ok(u_e_obj)) => {
                        let main_email_info_vec = u_e_obj.into_iter()
                            .filter(|x| x.primary)
                            .collect::<Vec<GitHubEmailInfo>>();

                        if main_email_info_vec.get(0).is_none() {
                            error!("unable to login user!");
                            return HttpResponse::InternalServerError().body("email unavailable!");
                        }
                        
                        let user_info = UserInfo {
                            _id: main_email_info_vec.get(0).unwrap().email.clone(),
                            email: main_email_info_vec.get(0).unwrap().clone().email,
                            username: None,
                            firstname: u_i_obj.name,
                            lastname: None,
                            is_premium_user: None,
                            member_since: None,
                            last_login: None,
                            number_of_logins: None,
                            login_source: LoginSource::GitHub
                        };
                        return match handle_user_login(&app_state.user_info_collection, user_info).await {
                            Ok(res) => {
                                HttpResponse::Ok().json(res)
                            },
                            Err(e) => {
                                error!("unable to login user!");
                                HttpResponse::InternalServerError().body(format!("{:?}", e))
                            }
                        };
                    },
                    (_, _) => {
                        error!("unable to login user!");    
                        return HttpResponse::InternalServerError().body("unable to login user!")
                    }
                }
            },
            (_, _) => {
                error!("unable to login user!");    
                return HttpResponse::InternalServerError().body("unable to login user!")
            } 
        }
    } else {
        HttpResponse::InternalServerError().body(
            format!("{:?}", web_api_res.error_message.unwrap_or("error".to_string()))
        )
    }
}
/********************************************************************************/

pub async fn test() -> HttpResponse {
    HttpResponse::Ok().body("Test!")
}