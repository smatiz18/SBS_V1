import axios, { AxiosResponse } from "axios";
import { NbaGameHistorical } from "../../models/nba-game-historical";
import { NbaOddsHistorical } from "../../models/odds/odds-historical";
import { GetNbaPlayersByTeamAndSeasonRequest } from "../../models/services/get-nba-players-by-team-and-season-request";
import { GetNbaPlayersByTeamAndSeasonResponse } from "../../models/services/get-nba-players-by-team-and-season-response";
import { GetNbaGamesByTeamAndSeasonRequest } from "../../models/services/get-nba-games-by-team-and-season-request";
import { GetNbaOddsByTeamAndSeasonRequest } from "../../models/services/get-nba-odds-by-team-and-season-request";
import { RUST_SERVER } from "../config";
import { GetNbaTeamAggGameStatsRequest } from "../../models/services/get-nba-team-agg-game-stats-request";
import { GetNbaTeamStatsRequest } from "../../models/services/get-nba-team-stats-request";
import { NbaTeamStats } from "../../models/nba-team-stats";
import { NbaTeamAggGameStatsHistorical } from "../../models/nba-team-agg-game-stats-historical";
import { WebApiRes } from "../../models/services/web-api-res";
import { NbaPlayerAggGameStatsHistorical } from "../../models/nba-player-agg-game-stats-historical";
import { GetNbaPlayerStatsByNameAndSeasonRequest } from "../../models/services/get-nba-player-stats-by-name-and-season-request";

export const NBA_API_ROOT = '/nba-api';

export const GET_NBA_LINEUPS = `${NBA_API_ROOT}/daily-matchups/get`;
export const GET_NBA_GAMES_BY_TEAM_AND_SEASON = `${NBA_API_ROOT}/historical-games/get`;
export const GET_NBA_ODDS_BY_TEAM_AND_SEASON = `${NBA_API_ROOT}/historical-odds/get`;
export const GET_NBA_PLAYERS_BY_TEAM_AND_SEASON = `${NBA_API_ROOT}/players-by-team-and-season/get`;
export const GET_NBA_PLAYERS_BY_STATS_NAME_AND_SEASON = `${NBA_API_ROOT}/player-stats-by-name-and-season/get`;
export const GET_NBA_TEAM_AGG_GAME_STATS = `${NBA_API_ROOT}/team-agg-game-stats/get`;
export const GET_NBA_TEAM_STATS = `${NBA_API_ROOT}/team-stats/get`;
export const GET_NBA_LIVE_SCORES = `${NBA_API_ROOT}/live-scores/get`;

export function getNbaMatchups(): Promise<AxiosResponse<WebApiRes>> {
  return axios.get<WebApiRes>(`${RUST_SERVER}${GET_NBA_LINEUPS}`);
}

export function getNbaGamesByTeamAndSeason(req: GetNbaGamesByTeamAndSeasonRequest): Promise<AxiosResponse<NbaGameHistorical[]>> {
  return axios.get<NbaGameHistorical[]>(`${RUST_SERVER}${GET_NBA_GAMES_BY_TEAM_AND_SEASON}?teamId=${req.teamId}&season=${req.season}`);
}

export function getNbaOddsByTeamAndSeason(req: GetNbaOddsByTeamAndSeasonRequest): Promise<AxiosResponse<NbaOddsHistorical[]>> {
  return axios.get<NbaOddsHistorical[]>(`${RUST_SERVER}${GET_NBA_ODDS_BY_TEAM_AND_SEASON}?teamName=${req.teamName}&season=${req.season}`); 
}

export function getNbaPlayersByTeamAndSeason(req: GetNbaPlayersByTeamAndSeasonRequest): Promise<AxiosResponse<GetNbaPlayersByTeamAndSeasonResponse>> {
  return axios.get<GetNbaPlayersByTeamAndSeasonResponse>(`${RUST_SERVER}${GET_NBA_PLAYERS_BY_TEAM_AND_SEASON}?teamId=${req.teamId}&season=${req.season}`);
}

export function getNbaPlayerStatsByNameAndSeason(req: GetNbaPlayerStatsByNameAndSeasonRequest): Promise<AxiosResponse<NbaPlayerAggGameStatsHistorical[]>> {
  return axios.post<NbaPlayerAggGameStatsHistorical[]>(`${RUST_SERVER}${GET_NBA_PLAYERS_BY_STATS_NAME_AND_SEASON}`, req);
}

export function getNbaTeamAggGameStats(req: GetNbaTeamAggGameStatsRequest) {
  return axios.post<NbaTeamAggGameStatsHistorical[]>(`${RUST_SERVER}${GET_NBA_TEAM_AGG_GAME_STATS}`, req);
}

export function getNbaTeamStats(req: GetNbaTeamStatsRequest) {
  return axios.post<NbaTeamStats[]>(`${RUST_SERVER}${GET_NBA_TEAM_STATS}`, req);
}

export function getNbaLiveScores() {
  return axios.get<WebApiRes>(`${RUST_SERVER}${GET_NBA_LIVE_SCORES}`);
}