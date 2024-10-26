import axios from "axios";
import { RUST_SERVER } from "../config";
import { Event } from "../../models/odds/odds";
import { GetOddsRequest } from "../../models/services/get-odds-request";

export const ODDS_API_ROOT = '/odds-api';

export const GET_ODDS = `${ODDS_API_ROOT}/odds/get`

export function getOdds(req: GetOddsRequest) {
    return axios.post<Event[]>(`${RUST_SERVER}${GET_ODDS}`, req);
}