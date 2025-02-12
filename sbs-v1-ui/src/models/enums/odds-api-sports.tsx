export enum OddsApiSports {
    BasketballNba = "BasketballNba"
}

export const sportsKeyToOddsApiSports: Map<string, OddsApiSports> = new Map([
    [ 'basketball_nba', OddsApiSports.BasketballNba ]
]);