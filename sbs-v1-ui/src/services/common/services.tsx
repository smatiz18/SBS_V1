import axios from 'axios';
import { RUST_SERVER } from '../config';
import { ExecuteMongoQueryRequest } from '../../models/services/execute-mongo-query-request';
import { GetLoginCredentialsResponse } from '../../models/services/get-login-credentials-response';
import { LoginAuthRequest } from '../../models/services/login-auth-request';
import { LoginResult } from '../../models/services/login-result';

export const DB_QUERY = '/db-query-api/query/get';
export const GET_LOGIN_CREDENTIALS = '/credentials-api/login/get';
export const GET_GOOGLE_AUTH = '/credentials-api/google-auth/get';
export const GET_GITHUB_AUTH = '/credentials-api/github-auth/get';

export function executeMongoQuery(req: ExecuteMongoQueryRequest) {
    return axios.post<any[]>(`${RUST_SERVER}${DB_QUERY}`, req);
}

export function getLoginCredentials() {
    return axios.get<GetLoginCredentialsResponse>(`${RUST_SERVER}${GET_LOGIN_CREDENTIALS}`);
}

export function getGoogleAuth(code: LoginAuthRequest) {
    return axios.post<LoginResult>(`${RUST_SERVER}${GET_GOOGLE_AUTH}`, code);
}

export function getGitHubAuth(code: LoginAuthRequest) {
    return axios.post<LoginResult>(`${RUST_SERVER}${GET_GITHUB_AUTH}`, code);
}