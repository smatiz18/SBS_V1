export interface NbaGameHistorical {
    mongoId: number,
    id: string,
    league?: string,
    season?: number,
    dateStart?: Date,
    teamsVisitorsId?: number,
    teamsVisitorsNickname?: string,
    teamsVisitorsCode?: string,
    teamsHomeId?: number,
    teamsHomeName?: string,
    teamsHomeNickname?: string,
    teamsHomeCode?: string,
    scoresVisitorsLinescore?: string[],
    scoresVisitorsPoints?: number,
    scoresHomeLinescore?: string[],
    scoresHomePoints: number
}