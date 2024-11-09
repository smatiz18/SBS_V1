import { BetOptions } from "../enums/bet-options";
import { Bookmakers } from "../enums/bookmakers";
import { BettingOddsCell } from "./betting-odds-table-params";

export interface OptimalOddsTableParams {
    optimalOddsCells: OptimalOddsCell[],
    rowOrdering: any[],
    colOrdering: any[],
    description: any
    betOption: BetOptions,
};

export interface OptimalOddsCell extends BettingOddsCell {
    bookmaker: Bookmakers
}