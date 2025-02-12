import { Bookmakers } from "../enums/bookmakers";
import { OddsApiRegions } from "../enums/odds-api-regions";
import { OddsApiSports } from "../enums/odds-api-sports";
import { OddsFormat } from "../enums/odds-format";

export interface GetOddsRequest {
    sports: OddsApiSports,
    regions: OddsApiRegions,
    markets: string[],
    oddsFormat: OddsFormat,
    bookmakers: Bookmakers[]
}