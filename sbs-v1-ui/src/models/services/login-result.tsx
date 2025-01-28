import { UserInfo } from "../user-info";

export interface LoginResult {
    isError: boolean,
    errorMessage?: String,
    userInfo?: UserInfo
}