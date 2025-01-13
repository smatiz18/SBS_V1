export interface ExecuteMongoQueryRequest {
    aggregationPipeline: string[],
    collectionName: string
}