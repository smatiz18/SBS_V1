
/* RUST SERVER ROUTES */
pub const SERVER_URL: &str = "127.0.0.1:8080";

pub const DB_QUERY_API_ROOT: &str = "db-query-api";
pub const ODDS_API_ROOT: &str = "odds-api";
pub const CREDENTIALS_API_ROOT: &str = "credentials-api";
pub const BACKTEST_API_ROOT: &str = "backtest-api";
pub const NBA_API_ROOT: &str = "nba-api";

pub const GET_HISTORICAL_GAMES: &str = "/historical-games/get";
pub const GET_HISTORICAL_ODDS: &str = "/historical-odds/get";
pub const GET_PLAYERS_BY_TEAM_AND_SEASON: &str = "/players-by-team-and-season/get";
pub const GET_PLAYER_STATS_BY_ID_AND_SEASON: &str = "/player-stats-by-id-and-season/get";
pub const GET_NBA_TEAM_AGG_GAME_STATS: &str = "/team-agg-game-stats/get";
pub const GET_NBA_TEAM_STATS: &str = "/team-stats/get";
pub const GET_NBA_DAILY_MATCHUPS: &str = "/daily-matchups/get";
pub const GET_BACKTEST_FEATURE_MAP: &str = "/backtest-feature-map/get";
pub const GET_ODDS: &str = "/odds/get";
pub const GET_EVENT_ODDS: &str = "/event-odds/get";
pub const GET_EVENTS: &str = "/events/get";
pub const EXECUTE_MONGO_QUERY: &str = "/query/get"; 
pub const GET_LOGIN_CREDENTIALS: &str = "/login/get";
pub const GET_GOOGLE_AUTH: &str = "/google-auth/get";
pub const GET_GITHUB_AUTH: &str = "/github-auth/get";

/* WEB API ROUTES */
pub const NBA_RAPID_API_HOST: &str = "api-nba-v1.p.rapidapi.com";
pub const NBA_RAPID_API_ROOT: &str = "https://api-nba-v1.p.rapidapi.com";
pub const THE_ODDS_API_ROOT: &str = "https://api.the-odds-api.com/v4/";
