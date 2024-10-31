export interface BettingOddsTableParams {
    description: string,
    rowOrdering: any[],
    colOrdering: any[],
    bettingOddsCells: BettingOddsCell[]
}

export interface BettingOddsCell {
    rowKey: any,
    colKey: any,
    point: number | string, 
    price: number | string, 
    description?: string
}