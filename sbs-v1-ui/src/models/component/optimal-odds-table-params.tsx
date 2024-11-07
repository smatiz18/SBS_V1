import { BetOptions } from "../enums/bet-options";
import { Bookmakers } from "../enums/bookmakers";
import { BettingOddsCell } from "./betting-odds-table-params";

export interface OptimalOddsTableParams {
    optimalOddsCells: (BettingOddsCell | SportsbookCell)[],
    rowOrdering?: string[],
    colOrdering?: string[],
    description?: string
    betOption: BetOptions,
};

export interface SportsbookCell {
    rowKey: any,
    colKey: any,
    sportsbook: Bookmakers
}