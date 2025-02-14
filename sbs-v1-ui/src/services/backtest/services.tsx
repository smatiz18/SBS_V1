import axios from "axios";
import { BacktestFeatureMapRequest } from "../../models/services/get-backtest-feature-map-request";
import { BacktestFeatureMapResponse } from "../../models/services/get-backtest-feature-map-response";
import { RUST_SERVER } from "../config";

export const BACKTEST_API_ROOT = '/backtest-api';
export const GET_BACKTEST_FEATURE_MAP = `${BACKTEST_API_ROOT}/backtest-feature-map/get`;

export function getFeatureMapForBacktest(req: BacktestFeatureMapRequest) {
    return axios.post<BacktestFeatureMapResponse>(`${RUST_SERVER}${GET_BACKTEST_FEATURE_MAP}`, req);
  }