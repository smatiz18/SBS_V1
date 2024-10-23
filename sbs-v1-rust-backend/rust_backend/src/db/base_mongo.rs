use mongodb::options::{AggregateOptions, FindOptions};
use mongodb::{Client, Collection};
use mongodb::bson::Document;
use mongodb::error::Result;
use serde::de::DeserializeOwned;
use futures_util::TryStreamExt;

pub async fn get_collection(
    uri: &str,
    db_name: &str,
    collection_name: &str
) -> Result<Collection<Document>> {
    // Create a MongoDB client
    let client = Client::with_uri_str(uri).await?;
    // Get a reference to the database
    let db = client.database(db_name);
    // Get a reference to the collection
    let collection = db.collection::<Document>(collection_name);

    Ok(collection)
}

pub async fn _get_document_count(collection: &Collection<Document>) -> Result<u64> {
    // Get the count of documents in the collection
    let count = collection.count_documents(None, None).await?;
    Ok(count)
}

/// A function that finds documents in a MongoDB collection based on a query.
/// 
/// # Parameters
/// - `collection`: The MongoDB collection to search in.
/// - `query`: The query used to filter documents.
/// 
/// # Returns
/// - A vector of documents that match the query.
pub async fn find<T>(
    collection: &Collection<T>,
    query: Document,
    options: Option<FindOptions>
) -> Result<Vec<T>>
where
    T: DeserializeOwned + Unpin + Send + Sync,
{
    let mut cursor = collection.find(query, options).await?;
    
    let mut results = Vec::new();
    while let Some(doc) = cursor.try_next().await? {
        results.push(doc);
    }

    Ok(results)
}

pub async fn _aggregate<T>(
    collection: &Collection<T>,
    pipelines: Vec<Document>,
    options: Option<AggregateOptions>
) -> Result<Vec<Document>>
where 
    T: DeserializeOwned + Unpin + Send + Sync,
{
    let mut cursor = collection.aggregate(pipelines, options).await?;
    
    let mut results = Vec::new();
    while let Some(doc) = cursor.try_next().await? {
        results.push(doc);
    }

    Ok(results)
} 
