export interface GetNbaMatchupsResponse {
    isError: boolean,
    error?: string,
    matchups: Matchup[],
    sportsbookLines: SportsbookLines[]
}

export interface Matchup {
    away: TeamInfo,
    home: TeamInfo,
    sportsBookLines: SportsbookLines,
}

export interface TeamInfo {
    projectedPlayers: string[],
    nickname: string,
    logo?: string 
}
export interface SportsbookLines {
    LINE: SportsBookObj,
    OU: SportsBookObj,
    SPREAD: SportsBookObj
}

export interface SportsBookObj {
    betmgm: any,
    draftkings: any,
    fanduel: any
} 

