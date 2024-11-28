import { SeasonType } from "./enums/season-type";

export interface NbaTeamStats {
    _id: string;
    teamId: number;
    teamName: string;
    teamNickname: string;
    season: number;
    seasonType: SeasonType;
    lastGameId: number;

    totalStreak: string;
    homeStreak: string;
    awayStreak: string;

    totalWins: number;
    totalLosses: number;
    lastTenTotalWins: number;
    lastTenTotalLosses: number;

    homeWins: number;
    homeLosses: number;
    lastTenHomeWins: number;
    lastTenHomeLosses: number;

    awayWins: number;
    awayLosses: number;
    lastTenAwayWins: number;
    lastTenAwayLosses: number;
}
