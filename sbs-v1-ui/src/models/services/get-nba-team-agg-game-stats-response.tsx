import { SeasonType } from "../enums/season-type";

export interface GetNbaTeamAggGameStatsResponse {
    aggGameStats: Record<any, NbaTeamAggGameStatsHistorical>;
}

export interface GameStats {
    teamId: any,
    gameId: number;
    points: number;
    linescore: number[],
    win: boolean,
    dateStart: string;
}

export interface NbaTeamAggGameStatsHistorical {
    _id: string; 
    teamId: number;
    season: number;
    seasonType: SeasonType;
    teamName: string;
    teamNickname: string;
    gameStats: Record<string, GameStats>;
}