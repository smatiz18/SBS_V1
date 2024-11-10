export interface GetNbaGameStatsAvgsResponse {
    gameStatsAvgs: Record<any, NbaGameStatsAvgsHistorical>;
}

export interface GameStats {
    points: number;
    linescoreQ1: number;
    linescoreQ2: number;
    linescoreQ3: number;
    linescoreQ4: number;
    gameId: number;
    dateStart: string;
}

export interface NbaGameStatsAvgsHistorical {
    _id: string; 
    teamId: number;
    season: number;
    seasonType: string;
    teamName: string;
    teamNickname: string;
    gameStats: Record<string, GameStats>;
    expandingAvg: Record<string, GameStats>;
    rollingAvg5: Record<string, GameStats>;
    rollingAvg10: Record<string, GameStats>;
}