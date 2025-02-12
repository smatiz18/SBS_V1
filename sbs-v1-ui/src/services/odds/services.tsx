import axios from "axios";
import { RUST_SERVER } from "../config";
import { GetOddsRequest } from "../../models/services/get-odds-request";
import { WebApiRes } from "../../models/services/web-api-res";
import { GetEventOddsRequest } from "../../models/services/get-event-odds-request";

export const ODDS_API_ROOT = '/odds-api';

export const GET_ODDS = `${ODDS_API_ROOT}/odds/get`
export const GET_EVENT_ODDS = `${ODDS_API_ROOT}/event-odds/get`;

export function getOdds(req: GetOddsRequest) {
    return axios.post<WebApiRes>(`${RUST_SERVER}${GET_ODDS}`, req);
}

export function getEventOdds(req: GetEventOddsRequest) {
    return axios.post<WebApiRes>(`${RUST_SERVER}${GET_EVENT_ODDS}`, req);
}