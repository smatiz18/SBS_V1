export interface GetNbaMatchupsResponse {
    isError: boolean,
    error?: string,
    teamMatchups: TeamMatchup[],
    projectedPlayerLineupsByTeam: Map<string, string[]>,
    sportsbookLines: SportsbookLines
}

export interface TeamMatchup {
    away: string,
    home: string
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

