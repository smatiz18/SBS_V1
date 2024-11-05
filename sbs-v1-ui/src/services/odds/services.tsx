import axios from "axios";
import { RUST_SERVER } from "../config";
import { GetOddsRequest } from "../../models/services/get-odds-request";
import { GetOddsResponse } from "../../models/services/get-odds-response";

export const ODDS_API_ROOT = '/odds-api';

export const GET_ODDS = `${ODDS_API_ROOT}/odds/get`

export function getOdds(req: GetOddsRequest) {
    return axios.post<GetOddsResponse>(`${RUST_SERVER}${GET_ODDS}`, req);
}