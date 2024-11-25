use crate::db::base_mongo::find as base_find;
use crate::models::db::nba_team_stats::NbaTeamStats;
use crate::models::enums::season_type::SeasonType;
use bson::to_document;
use futures::future::join_all;
use mongodb::options::{FindOptions, UpdateOptions};
use mongodb::Collection;
use mongodb::bson::{doc, Document, from_document};
use mongodb::error::Result;

pub async fn get_nba_team_stats(
   collection: &Collection<Document>, 
   team_ids: Vec<f64>, 
   season_opt: Option<u32>,
   season_type_opt: Option<SeasonType>
) -> Result<Vec<NbaTeamStats>> {
    let mut query: Document = doc! {
        "teamId": { "$in": team_ids }
    };
    if season_opt.is_some() {
       query.insert("season", season_opt.unwrap());
    }
    if season_type_opt.is_some() {
       query.insert("seasonType", season_type_opt.unwrap().to_string());
    }

   find(collection, query, None).await
} 

pub async fn upsert(
    collection: &Collection<Document>,
    nba_team_stats: Vec<NbaTeamStats>
) -> core::result::Result<String, String> {

    let mut errors: Vec<String> = vec!();
    let mut successes: Vec<String> = vec!();

    // info!("NBA TEAM STATS {:?}:", nba_team_stats);

    let update_result_futs: Vec<_> = nba_team_stats.into_iter()
        .flat_map(|ts| { 
            match to_document(&ts) {
                Ok(doc) => {
                    let mut update_options = UpdateOptions::default();
                    update_options.upsert = Some(true);
                    let find_query = doc! {
                        "_id": ts.mongo_id
                    };

                    let update_doc = doc! {
                        "$set": doc
                    };
                    
                    Some(
                        collection.update_one( 
                            find_query, 
                            update_doc,
                            Some(update_options)
                        )
                    )
                },
                Err(e) => {
                    errors.push(format!("{:?}", e));
                    None
                }
            }
        }).collect();

    let results = join_all(update_result_futs).await;
    
    results.into_iter()
        .for_each(|res| {
            match res {
                Ok(r) => successes.push(format!("{:?}", r)),
                Err(e) => errors.push(format!("{:?}", e))
            }
        });

    
    if errors.len() > 0 {
        Err(format!("ERRORS Updating Team Stats:\n {:?}", errors.join("\n")))
    } else {
        Ok(format!("Success Updating Team Stats:\n {:?}", successes.join("\n")))
    }
}

pub async fn find(
   collection: &Collection<Document>,
   match_query: Document,
   options: Option<FindOptions>
) -> Result<Vec<NbaTeamStats>> {
    let results = base_find(&collection, match_query, options).await?;
    Ok(parse_doc_to_obj(results))
}

fn parse_doc_to_obj(
   docs: Vec<Document>
) -> Vec<NbaTeamStats> {
   docs.iter()
      .flat_map(|doc| 
         match from_document::<NbaTeamStats>(doc.clone()) {
            Ok(obj) => Some(obj),
            Err(e) => {
               println!("Failed to convert doc to obj: {}", e);
               None
            }
         }
      )
      .collect()
}
