import { QuickStatsCellParams } from "./quick-stats-cell-params";

export interface QuickStatsTableParams {
    rows: QuickStatsCellParams[][],
    headers: any[],
    aggregations?: any[]
}