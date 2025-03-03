import { UserInfo } from "../user-info";

export interface LoginResult {
    isError: boolean,
    errorMessage?: string,
    userInfo?: UserInfo
}