export interface BettingOddsTableParams {
    description: string,
    bettingOddsCells: BettingOddsCell[]
}

export interface BettingOddsCell {
    rowKey: any,
    colKey: any,
    point: number, 
    price: number,
    description?: string
}