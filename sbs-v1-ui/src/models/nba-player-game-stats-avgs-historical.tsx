import { PlayerStatsObj } from "./nba-player-game-stats-historical";
import { SeasonType } from "./season-type";

export interface NbaPlayerGameStatsAvgsHistorical {
    _id: string;
    playerId: number;
    teamId: number;
    seasonType: SeasonType;
    firstname: string;
    lastname: string;
    birthday?: string;
    countryOfBirth?: string;
    playerStats: Map<number, PlayerStatsObj>;
    expandingAvg: Map<number, PlayerStatsObj>;
    rollingAvg5: Map<number, PlayerStatsObj>;
    rollingAvg10: Map<number, PlayerStatsObj>;
  }