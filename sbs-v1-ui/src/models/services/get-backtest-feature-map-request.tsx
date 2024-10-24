import { PlayerBetTypes } from "../nba/player-bet-types";
import { SportsCategories } from "../sports-categories";
import { StakingStrategies } from "../staking-strategies";
import { TeamBetTypes } from "../team-bet-types";

export interface BacktestFeatureMapRequest {
    sportsCategory: SportsCategories,
    season: number,
    teamId: number,
    teamBetType?: TeamBetTypes,
    playerBetType?: PlayerBetTypes,
    stakingStrategy: StakingStrategies,
    oddsSource: String,
    bankRoll: number,
    model: String,
    playerId?: number
}