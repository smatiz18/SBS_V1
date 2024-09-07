import axios, { AxiosResponse } from "axios";
import { GetNbaMatchupsResponse } from "../../models/services/get-nba-matchups-response";
import { GetNbaGamesByTeamAndSeasonRequest } from "../../models/services/get-nba-games-req-by-team-and-season";
import { NbaGameHistorical } from "../../models/nba-game-historical";
import { GetNbaOddsByTeamAndSeasonRequest } from "../../models/services/get-nba-odds-req-by-team-and-season";
import { NbaOddsHistorical } from "../../models/nba-odds-historical";
import { link } from "fs";

export const PYTHON_SERVER = 'http://127.0.0.1:8000';
export const RUST_SERVER = 'http://127.0.0.1:8080';
export const NBA_API_ROOT = '/nba-api';

export const GET_NBA_LINEUPS = `${NBA_API_ROOT}/get-matchups`;
export const GET_NBA_GAMES_BY_TEAM_AND_SEASON = `${NBA_API_ROOT}/historical-games/get`;
export const GET_NBA_ODDS_BY_TEAM_AND_SEASON = `${NBA_API_ROOT}/historical-odds/get`;
export const GET_NBA_PLAYERS_BY_TEAM_AND_SEASON = `${NBA_API_ROOT}/players-by-team-and-season/get`;

export function getNbaMatchups(): Promise<AxiosResponse<GetNbaMatchupsResponse>> {
  return axios.get<GetNbaMatchupsResponse>(`${PYTHON_SERVER}${GET_NBA_LINEUPS}`);
}

export function get_nba_games_by_team_and_season(req: GetNbaGamesByTeamAndSeasonRequest): Promise<AxiosResponse<NbaGameHistorical[]>> {
  return axios.get<NbaGameHistorical[]>(`${RUST_SERVER}${GET_NBA_GAMES_BY_TEAM_AND_SEASON}?teamNickname=${req.teamNickname}&season=${req.season}`);
}

export function get_nba_odds_by_team_and_season(req: GetNbaOddsByTeamAndSeasonRequest): Promise<AxiosResponse<NbaOddsHistorical[]>> {
  return axios.get<NbaOddsHistorical[]>(`${RUST_SERVER}${GET_NBA_ODDS_BY_TEAM_AND_SEASON}?teamName=${req.teamName}&season=${req.season}`); 
}

export function get_nba_players_by_team_and_season(req: GetNbaPlayersByTeamAndSeason): Promise<AxiosResponse<>> {
  return axios.get<NbaPlayers
}