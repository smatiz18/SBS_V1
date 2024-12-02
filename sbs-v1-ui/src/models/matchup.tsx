import { SportsCategories } from "./enums/sports-categories";
import { NbaTeamAggGameStatsHistorical } from "./nba-team-agg-game-stats-historical";
import { NbaTeamStats } from "./nba-team-stats";
import { Event } from "./odds/odds";
import { OptimalOdds } from "./services/get-odds-response";

export interface Matchup {
    away: TeamInfo,
    home: TeamInfo,
    sportsCategory: SportsCategories,
    odds?: Event,
    optimalOdds?: OptimalOdds[],
    dateStart?: any;
}

export interface TeamInfo {
    projectedPlayers: string[],
    teamStats: NbaTeamStats; // expand this to include other sport types
    teamAggGameStats: NbaTeamAggGameStatsHistorical,
    teamName: string,
    teamNickname: string,
    teamLogo: string,
}

