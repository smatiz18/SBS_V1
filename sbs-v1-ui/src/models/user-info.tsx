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
    memberSince?: Date,
    lastLogin?: Date,
    numberOfLogins?: number,
    loginSource: LoginSource
}