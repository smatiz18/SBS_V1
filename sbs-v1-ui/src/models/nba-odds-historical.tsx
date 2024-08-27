export interface NbaOddsHistorical {
    mongoId: string;
    sportKey: string;
    sportTitle: string;
    awayTeam: string;
    nbaApiId: number;
    oddsApiId: string;
    dateStart: Date;
    season: number;
    bookmakerOdds: BookmakerOdds[];
}

export interface BookmakerOdds {
    key: string;
    title: string;
    lastUpdate: Date;
    markets: Market[];
}

export interface Market {
    key: string;
    lastUpdate: Date;
    outcomes: Outcome[];
}

export interface Outcome {
    name: string;
    price: number;
    description?: string;
    point?: number
}
