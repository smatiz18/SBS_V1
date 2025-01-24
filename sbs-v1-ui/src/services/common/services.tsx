import axios from "axios";
import { RUST_SERVER } from "../config";
import { ExecuteMongoQueryRequest } from "../../models/services/execute-mongo-query-request";
import { GetLoginCredentialsResponse } from "../../models/services/get-login-credentials-response";
import { LoginAuthRequest } from "../../models/services/login-auth-request";

export const DB_QUERY = "/db-query-api/query/get";
export const GET_LOGIN_CREDENTIALS = "/credentials-api/login/get";
export const GET_GOOGLE_AUTH = "/credentials-api/google-auth/get";

export function executeMongoQuery(req: ExecuteMongoQueryRequest) {
    return axios.post<any[]>(`${RUST_SERVER}${DB_QUERY}`, req);
}

export function getLoginCredentials() {
    return axios.get<GetLoginCredentialsResponse>(`${RUST_SERVER}${GET_LOGIN_CREDENTIALS}`);
}

export function getGoogleAuth(accessToken: LoginAuthRequest) {
    return axios.post<any>(`${RUST_SERVER}${GET_GOOGLE_AUTH}`, accessToken);
}