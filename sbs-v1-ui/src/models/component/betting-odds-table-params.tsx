import { BetOptions } from "../enums/bet-options"

export interface BettingOddsTableParams {
    description: string,
    rowOrdering: any[],
    colOrdering: any[],
    betOption: BetOptions,
    bettingOddsCells: BettingOddsCell[]
}

export interface BettingOddsCell {
    rowKey: any,
    colKey: any,
    point: number | string, 
    price: number | string, 
    description?: string
}