export interface Event {
    id: string;
    sportKey: string;
    sportTitle: string;
    commenceTime: Date;
    homeTeam: string;
    awayTeam: string;
    bookmakers: Bookmaker[];
}

export interface Outcome {
    name: string;
    price: number;
    description?: string;
    point?: number;
}

export interface Market {
    key: string;
    lastUpdate: Date;
    outcomes: Outcome[];
}

export interface Bookmaker {
    key: string;
    title: string;
    lastUpdate: Date;
    markets: Market[];
}