import { GameStatsOption } from "./game-stats-option";
import { QuickStatsAggregation } from "./quick-stats-aggregation";

interface GameStatsLine {
    gameStatsOption: GameStatsOption,
    aggregation: QuickStatsAggregation,
    drawLineOfBestFit?: boolean,
    avgsScope?: number
}