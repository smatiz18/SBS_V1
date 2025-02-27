import { SeasonType } from "../enums/season-type";

export interface GetNbaPlayerStatsByNameAndSeasonRequest {
    names: Name[]
    season: number,
    seasonType: SeasonType
}

export interface Name {
    firstname: string,
    lastname: string
}