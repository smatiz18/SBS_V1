import axios, { AxiosResponse } from "axios";
import { GetNbaMatchupsResponse } from "../../models/services/get-nba-matchups-response";
import { NbaGameHistorical } from "../../models/nba-game-historical";
import { NbaOddsHistorical } from "../../models/nba-odds-historical";
import { GetNbaPlayersByTeamAndSeasonRequest } from "../../models/services/get-nba-players-by-team-and-season-request";
import { GetNbaPlayersByTeamAndSeasonResponse } from "../../models/services/get-nba-players-by-team-and-season-response";
import { GetNbaGamesByTeamAndSeasonRequest } from "../../models/services/get-nba-games-by-team-and-season-request";
import { GetNbaOddsByTeamAndSeasonRequest } from "../../models/services/get-nba-odds-by-team-and-season-request";
import { GetNbaPlayerStatsByIdAndSeasonRequest } from "../../models/services/get-nba-player-stats-by-id-and-season-request";
import { NbaPlayerGameStatsAvgsHistorical } from "../../models/nba-player-game-stats-avgs-historical";

export const PYTHON_SERVER = 'http://127.0.0.1:8000';
export const RUST_SERVER = 'http://127.0.0.1:8080';
export const NBA_API_ROOT = '/nba-api';

export const GET_NBA_LINEUPS = `${NBA_API_ROOT}/get-matchups`;
export const GET_NBA_GAMES_BY_TEAM_AND_SEASON = `${NBA_API_ROOT}/historical-games/get`;
export const GET_NBA_ODDS_BY_TEAM_AND_SEASON = `${NBA_API_ROOT}/historical-odds/get`;
export const GET_NBA_PLAYERS_BY_TEAM_AND_SEASON = `${NBA_API_ROOT}/players-by-team-and-season/get`;
export const GET_NBA_PLAYER_STATS_BY_ID_AND_SEASON = `${NBA_API_ROOT}/player-stats-by-id-and-season/get`;

export function getNbaMatchups(): Promise<AxiosResponse<GetNbaMatchupsResponse>> {
  return axios.get<GetNbaMatchupsResponse>(`${PYTHON_SERVER}${GET_NBA_LINEUPS}`);
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

export function getNbaPlayerStatsByIdAndSeason(req: GetNbaPlayerStatsByIdAndSeasonRequest) {
  return axios.get<NbaPlayerGameStatsAvgsHistorical>(`${RUST_SERVER}${GET_NBA_PLAYER_STATS_BY_ID_AND_SEASON}?playerId=${req.playerId}&season=${req.season}`);
}