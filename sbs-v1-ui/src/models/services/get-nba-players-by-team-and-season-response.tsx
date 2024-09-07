export interface GetNbaPlayersByTeamAndSeasonResponse {
    get: string;
    parameters: Parameters;
    errors: string[];
    results: number;
    response: Player[];
}

export interface Parameters {
    season: string;
    team: string;
}

export interface Player {
    id: number;
    firstname: string;
    lastname: string;
    birth?: BirthInfo;
    nba: NbaInfo;
    height?: HeightInfo;
    weight?: WeightInfo;
    college?: string;
    affiliation?: string;
    leagues?: Leagues;
}

export interface BirthInfo {
    date?: string;
    country?: string;
}

export interface NbaInfo {
    start: number;
    pro: number;
}

export interface HeightInfo {
    feets?: string;
    inches?: string;
    meters?: string;
}

export interface WeightInfo {
    pounds?: string;
    kilograms?: string;
}

export interface Leagues {
    standard?: LeagueInfo;
    africa?: LeagueInfo;
    vegas?: LeagueInfo;
    utah?: LeagueInfo;
    sacramento?: LeagueInfo;
}

export interface LeagueInfo {
    jersey?: number;
    active: boolean;
    pos?: string;
}
