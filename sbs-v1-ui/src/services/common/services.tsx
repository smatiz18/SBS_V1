import axios from "axios";
import { RUST_SERVER } from "../config";
import { ExecuteMongoQueryRequest } from "../../models/services/execute-mongo-query-request";

export const DB_QUERY = "/db-query-api/query/get";

export function executeMongoQuery(req: ExecuteMongoQueryRequest) {
    return axios.post<any[]>(`${RUST_SERVER}${DB_QUERY}`, req);
}