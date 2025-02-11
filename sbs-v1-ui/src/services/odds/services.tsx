import axios from "axios";
import { RUST_SERVER } from "../config";
import { GetOddsRequest } from "../../models/services/get-odds-request";
import { WebApiRes } from "../../models/services/web-api-res";

export const ODDS_API_ROOT = '/odds-api';

export const GET_ODDS = `${ODDS_API_ROOT}/odds/get`

export function getOdds(req: GetOddsRequest) {
    return axios.post<WebApiRes>(`${RUST_SERVER}${GET_ODDS}`, req);
}