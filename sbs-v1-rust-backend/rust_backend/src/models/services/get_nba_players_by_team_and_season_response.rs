use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GetNbaPlayersByTeamAndSeasonResponse {
    get: String,
    parameters: Parameters,
    errors: Vec<String>,
    results: u32,
    response: Vec<Player>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Parameters {
    season: String,
    team: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Player {
    id: u32,
    firstname: String,
    lastname: String,
    birth: Option<BirthInfo>,
    nba: NbaInfo,
    height: Option<HeightInfo>,
    weight: Option<WeightInfo>,
    college: Option<String>,
    affiliation: Option<String>,
    leagues: Option<Leagues>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BirthInfo {
    date: Option<String>,
    country: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NbaInfo {
    start: u16,
    pro: u16,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct HeightInfo {
    feets: Option<String>,
    inches: Option<String>,
    meters: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WeightInfo {
    pounds: Option<String>,
    kilograms: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Leagues {
    standard: Option<LeagueInfo>,
    africa: Option<LeagueInfo>,
    vegas: Option<LeagueInfo>,
    utah: Option<LeagueInfo>,
    sacramento: Option<LeagueInfo>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LeagueInfo {
    jersey: Option<u8>,
    active: bool,
    pos: Option<String>,
}