import { OddsApiSports } from "./odds-api-sports";

export enum TeamBetTypes {
    H2H = 'h2h',
    Spreads = 'spreads',
    Totals = 'totals'
}

export const supportedTeamMarketsBySport: Map<OddsApiSports, TeamBetTypes[]> = new Map([
    [
        OddsApiSports.BasketballNba, 
        [
            TeamBetTypes.H2H,
            TeamBetTypes.Spreads,
            TeamBetTypes.Totals
        ]
    ]
]);