export enum LoginSource {
    Gmail = 'Gmail',
    GitHub = 'GitHub'
}

export interface UserInfo {
    email: String,
    username?: String,
    firstname?: string,
    lastname?: string,
    isPremiumUser?: boolean,
    memberSince?: string,
    lastLogin?: string,
    numberOfLogins?: number,
    loginSource: LoginSource
}