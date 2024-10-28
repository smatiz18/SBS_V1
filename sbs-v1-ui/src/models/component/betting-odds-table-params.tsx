export interface BettingOddsTableParams {
    description: string,
    bettingOddsCells: BettingOddsCell[]
}

export interface BettingOddsCell {
    rowKey: any,
    rowLabel: string
    colKey: any,
    colLabel: string, 
    point: number, 
    price: number,
    description?: string
}