import { SportsCategories } from "./enums/sports-categories";
import { NbaTeamAggGameStatsHistorical } from "./nba-team-agg-game-stats-historical";
import { NbaTeamStats } from "./nba-team-stats";
import { Event } from "./odds/odds";

export interface Matchup {
    away: TeamInfo,
    home: TeamInfo,
    sportsCategory: SportsCategories,
    oddsEvent?: Event,
    dateStart?: any;
}

export interface TeamInfo {
    projectedPlayers: string[],
    teamStats: NbaTeamStats; // expand this to include other sport types
    teamAggGameStats: NbaTeamAggGameStatsHistorical,
    playerAggGameStats: any // NbaPlayerAggGameStatsHistorical[],
    teamName: string,
    teamNickname: string,
    teamLogo: string,
}

