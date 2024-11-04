import { BetOptions } from "../enums/bet-options"
import { Bookmakers } from "../enums/bookmakers"

export interface BettingOddsTableParams {
    description: string,
    rowOrdering: any[],
    colOrdering: any[],
    betOption: BetOptions,
    bettingOddsCells: BettingOddsCell[],
    bookmaker?: Bookmakers
}

export interface BettingOddsCell {
    rowKey: any,
    colKey: any,
    point: number | string, 
    price: number | string, 
    description?: string
}