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
    pub live: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Game {
    pub id: u32,
    pub league: String,
    pub season: u32,
    pub date: GameDate,
    pub stage: u8,
    pub status: Status,
    pub periods: Periods,
    pub arena: Arena,
    pub teams: Teams,
    pub scores: Scores,
    pub officials: Vec<String>, // currently empty
    pub times_tied: Option<u32>,
    pub lead_changes: Option<u32>,
    pub nugget: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GameDate {
    pub start: String,
    pub end: Option<String>,
    pub duration: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Status {
    pub clock: String,
    pub halftime: bool,
    pub short: u8,
    pub long: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Periods {
    pub current: u8,
    pub total: u8,
    pub end_of_period: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Arena {
    pub name: String,
    pub city: String,
    pub state: String,
    pub country: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Teams {
    pub visitors: Team,
    pub home: Team,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Team {
    pub id: u32,
    pub name: String,
    pub nickname: String,
    pub code: String,
    pub logo: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Scores {
    pub visitors: Score,
    pub home: Score,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Score {
    pub win: u32,
    pub loss: u32,
    pub series: Series,
    pub linescore: Vec<String>,
    pub points: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Series {
    pub win: u32,
    pub loss: u32,
}
