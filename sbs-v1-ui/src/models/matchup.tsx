import { Event } from "./odds/odds";

export interface Matchup {
    away: TeamInfo,
    home: TeamInfo,
    odds?: Event
}

export interface TeamInfo {
    projectedPlayers: string[],
    teamName: string,
    teamNickname: string,
    teamLogo: string,
}

