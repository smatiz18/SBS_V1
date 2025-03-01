import { GameLocationsFilter } from "../enums/game-locations-filter";
import { NbaPlayerStatsOption } from "../enums/nba-player-stats-option";
import { QuickStatsAggregation } from "../enums/quick-stats-aggregation";

export interface NbaPlayerGameStatsFilters {
    id: any,
    teamIdFilter?: number,
    gameLocationFilter: GameLocationsFilter,
    playerStatsOption: NbaPlayerStatsOption,
    showLineOfBestFit: boolean,
    showStdDeviationLines: boolean,
    showMinMaxLines: boolean,
    aggregation: QuickStatsAggregation,
    aggregationSlice: number,
    numberOfGames?: number,
}