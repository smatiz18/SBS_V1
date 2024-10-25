import { Bookmaker } from "./odds";

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

export interface BookmakerOdds extends Bookmaker { }