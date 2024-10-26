import { Bookmakers } from "../enums/bookmakers";
import { OddsApiRegions } from "../enums/odds-api-regions";
import { OddsApiSports } from "../enums/odds-api-sports";
import { OddsFormat } from "../enums/odds-format";
import { TeamBetTypes } from "../enums/team-bet-types";

export interface GetOddsRequest {
    sports: OddsApiSports,
    regions: OddsApiRegions,
    markets: TeamBetTypes[],
    oddsFormat: OddsFormat,
    bookmakers: Bookmakers[]
}