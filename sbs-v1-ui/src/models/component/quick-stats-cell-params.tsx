export interface QuickStatsCellParams {
    label: any,
    // not necessarily positive or negative, in this context green or red
    positive?: boolean, 
    negative?: boolean,
    aggregation?: boolean
}