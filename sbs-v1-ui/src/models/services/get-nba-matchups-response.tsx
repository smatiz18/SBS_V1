export interface GetNbaMatchupsResponse {
    isError: boolean,
    error?: string,
    matchups: Matchup[],
    sportsbookLines: Record<string, SportsbookLines>
}

export interface Matchup {
    away: TeamInfo,
    home: TeamInfo,
    sportsbookLines?: SportsbookLines,
}

export interface TeamInfo {
    projectedPlayers: string[],
    nickname: string,
    teamLogo: string,
}

export interface SportsbookLines {
    teamNickname?: string,
    LINE: SportsBookObj,
    OU: SportsBookObj,
    SPREAD: SportsBookObj
}

export interface SportsBookObj {
    betmgm: any,
    draftkings: any,
    fanduel: any
} 

