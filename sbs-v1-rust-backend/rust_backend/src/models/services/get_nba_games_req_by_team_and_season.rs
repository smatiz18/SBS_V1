use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct GetNbaGameReqByTeamAndSeason {
    teamNickname: String,
    teamSeason: f32
}