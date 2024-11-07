import { SportsCategories } from "./enums/sports-categories";
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
    teamName: string,
    teamNickname: string,
    teamLogo: string,
}

