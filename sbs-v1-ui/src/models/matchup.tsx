import { SportsCategories } from "./enums/sports-categories";
import { NbaTeamStats } from "./nba-team-stats";
import { Event } from "./odds/odds";
import { NbaTeamAggGameStatsHistorical } from "./services/get-nba-team-agg-game-stats-response";
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
    teamName: string,
    teamNickname: string,
    teamLogo: string,
}

