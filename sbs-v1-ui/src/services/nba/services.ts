import axios from "axios";
import { GetNbaMatchupsResponse } from "../../models/services/get-nba-matchups-response";

export const GET_NBA_LINEUPS = '/get-nba-matchups';
export const DEV_SERVER = 'http://127.0.0.1:8000';
export const SERVER = 'http://127.0.0.1:8000';

export function getNbaLineups() {
  return axios.get<GetNbaMatchupsResponse>(`${SERVER}${GET_NBA_LINEUPS}`);
}