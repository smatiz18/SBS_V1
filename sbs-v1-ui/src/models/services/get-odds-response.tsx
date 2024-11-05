import { Bookmakers } from "../enums/bookmakers"
import { PlayerBetTypes } from "../enums/player-bet-types"
import { TeamBetTypes } from "../enums/team-bet-types"
import { Event } from "../odds/odds"

export interface GetOddsResponse {
    events: Event[],
    optimalOdds?: Record<string, OptimalOdds>
}

export interface OptimalOdds {
    bookamer: Bookmakers,
    name: string,
    price: number,
    betType: TeamBetTypes | PlayerBetTypes,
    point?: number
}