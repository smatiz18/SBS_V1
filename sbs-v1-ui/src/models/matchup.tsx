import { SportsCategories } from "./enums/sports-categories";
import { Event } from "./odds/odds";

export interface Matchup {
    away: TeamInfo,
    home: TeamInfo,
    sportsCategory: SportsCategories,
    odds?: Event
}

export interface TeamInfo {
    projectedPlayers: string[],
    teamName: string,
    teamNickname: string,
    teamLogo: string,
}

