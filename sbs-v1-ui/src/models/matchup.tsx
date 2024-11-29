import { SportsCategories } from "./enums/sports-categories";
import { NbaTeamStats } from "./nba-team-stats";
import { Event } from "./odds/odds";
import { OptimalOdds } from "./services/get-odds-response";

export interface Matchup {
    away: TeamInfo,
    home: TeamInfo,
    sportsCategory: SportsCategories,
    odds?: Event,
    optimalOdds?: OptimalOdds[]
}

export interface TeamInfo {
    projectedPlayers: string[],
    teamStats: NbaTeamStats; // expand this to include other sport types
    teamName: string,
    teamNickname: string,
    teamLogo: string,
}

