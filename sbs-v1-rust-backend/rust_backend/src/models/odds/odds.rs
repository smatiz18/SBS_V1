use chrono::{DateTime, Utc};
use serde::{ser::SerializeStruct, Deserialize, Serialize, Serializer};

#[derive(Deserialize, Debug, Clone)]
pub struct Event {
    pub id: String,
    pub sport_key: String,
    pub sport_title: String,
    pub commence_time: DateTime<Utc>,
    pub home_team: String,
    pub away_team: String,
    pub bookmakers: Option<Vec<Bookmaker>>,
}

impl Serialize for Event {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer
    {
        let mut state = serializer.serialize_struct("Event", 4)?;
        state.serialize_field("id", &self.id)?;
        state.serialize_field("sportKey", &self.sport_key)?;
        state.serialize_field("sportTitle", &self.sport_title)?;
        state.serialize_field("commenceTime", &self.commence_time)?;
        state.serialize_field("homeTeam", &self.home_team)?;
        state.serialize_field("awayTeam", &self.away_team)?;
        state.serialize_field("bookmakers", &self.bookmakers)?;

        state.end()
    }
}

#[derive(Deserialize, Debug, Clone)]
pub struct Bookmaker {
    pub key: String,
    pub title: String,
    pub last_update: Option<DateTime<Utc>>,
    pub markets: Vec<Market>,
}

impl Serialize for Bookmaker {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer
    {
        let mut state = serializer.serialize_struct("Bookmaker", 1)?;
        
        state.serialize_field("key", &self.key)?;
        state.serialize_field("title", &self.title)?;
        state.serialize_field("lastUpdate", &self.last_update)?;
        state.serialize_field("markets", &self.markets)?;
        state.end()
    }
}


#[derive(Deserialize, Debug, Clone)]
pub struct Market {
    pub key: String,
    pub last_update: DateTime<Utc>,
    pub outcomes: Vec<Outcome>,
}

impl Serialize for Market {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer
    {
        let mut state = serializer.serialize_struct("Market", 1)?;
        state.serialize_field("key", &self.key)?;
        state.serialize_field("lastUpdate", &self.last_update)?;
        state.serialize_field("outcomes", &self.outcomes)?;
        state.end()
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Outcome {
    pub name: String,
    pub price: f64,
    pub description: Option<String>,
    pub point: Option<f64>,
}