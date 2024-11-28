import { SeasonType } from "../enums/season-type";

export interface GetNbaTeamStatsRequest {
    teamIds: number[],
    season?: number,
    seasonType?: SeasonType
}