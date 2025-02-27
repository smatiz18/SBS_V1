import { PlayerStatsObj } from "./nba-player-game-stats-historical";

export interface NbaPlayerAggGameStatsHistorical {
    _id: string;
    playerId: number;
    teamId: number;
    season?: string;
    seasonType?: string;
    firstname?: string;
    lastname?: string;
    birthday?: string;
    countryOfBirth?: string;
    playerStats: Record<string, PlayerStatsObj>; // HashMap<String, PlayerStatsObj> → Record<string, PlayerStatsObj>
  }