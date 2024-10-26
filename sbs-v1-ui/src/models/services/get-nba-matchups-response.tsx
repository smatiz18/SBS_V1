import { Matchup } from "../matchup"

export interface GetNbaMatchupsResponse {
    isError: boolean,
    error?: string,
    matchups: Matchup[]
}