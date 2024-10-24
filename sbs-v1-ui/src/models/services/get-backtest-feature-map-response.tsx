import { NbaBacktestPlayerFeatures } from "../features/nba-backtest-player-features";
import { NbaBacktestTeamFeatures } from "../features/nba-backtest-team-features";

export interface BacktestFeatureMapResponse {
    error?: String,
    teamFeatureMap?: NbaBacktestTeamFeatures[],
    playerFeatureMap?: NbaBacktestPlayerFeatures[]
}