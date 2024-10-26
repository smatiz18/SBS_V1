import { PlayerBetTypes } from "../enums/player-bet-types";
import { SportsCategories } from "../enums/sports-categories";
import { StakingStrategies } from "../enums/staking-strategies";
import { TeamBetTypes } from "../enums/team-bet-types";

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