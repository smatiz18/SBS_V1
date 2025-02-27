import { SportsCategories } from "./enums/sports-categories";
import { NbaPlayerAggGameStatsHistorical } from "./nba-player-agg-game-stats-historical";
import { NbaTeamAggGameStatsHistorical } from "./nba-team-agg-game-stats-historical";
import { NbaTeamStats } from "./nba-team-stats";
import { Event } from "./odds/odds";

export interface Matchup {
    away: TeamInfo,
    home: TeamInfo,
    sportsCategory: SportsCategories,
    playerAggGameStats: NbaPlayerAggGameStatsHistorical[],
    oddsEvent?: Event,
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

