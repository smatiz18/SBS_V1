use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GetNbaLiveScoresResponse {
    pub get: String,
    pub parameters: Parameters,
    pub errors: Vec<String>,
    pub results: u32,
    pub response: Vec<Game>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Parameters {
    pub live: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Game {
    pub id: Option<u32>,
    pub league: Option<String>,
    pub season: Option<u32>,
    pub date: Option<GameDate>,
    pub stage: Option<u8>,
    pub status: Option<Status>,
    pub periods: Option<Periods>,
    pub arena: Option<Arena>,
    pub teams: Option<Teams>,
    pub scores: Option<Scores>,
    pub officials: Option<Vec<String>>,
    pub times_tied: Option<u32>,
    pub lead_changes: Option<u32>,
    pub nugget: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GameDate {
    pub start: Option<String>,
    pub end: Option<String>,
    pub duration: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Status {
    pub clock: Option<String>,
    pub halftime: Option<bool>,
    pub short: Option<u8>,
    pub long: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Periods {
    pub current: Option<u8>,
    pub total: Option<u8>,
    pub end_of_period: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Arena {
    pub name: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
    pub country: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Teams {
    pub visitors: Option<Team>,
    pub home: Option<Team>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Team {
    pub id: Option<u32>,
    pub name: Option<String>,
    pub nickname: Option<String>,
    pub code: Option<String>,
    pub logo: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Scores {
    pub visitors: Option<Score>,
    pub home: Option<Score>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Score {
    pub win: Option<u32>,
    pub loss: Option<u32>,
    pub series: Option<Series>,
    pub linescore: Option<Vec<String>>,
    pub points: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Series {
    pub win: Option<u32>,
    pub loss: Option<u32>,
}
