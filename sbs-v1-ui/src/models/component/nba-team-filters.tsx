import { GameLocationsFilter } from "../enums/game-locations-filter";
import { GameStatsOption } from "../enums/game-stats-option";
import { QuickStatsAggregation } from "../enums/quick-stats-aggregation";
import { TeamOptionsFilter } from "../enums/team-options-filter";

export interface NbaTeamFilters { 
    teamFilter: TeamOptionsFilter,
    gameLocationFilter: GameLocationsFilter,
    gameStatsLineComparator: GameStatsFilters,
    additionalGameStatsLines: GameStatsFilters[],
}

export interface GameStatsFilters {
    gameStatsOption: GameStatsOption,
    aggregation: QuickStatsAggregation,
    lineOfBestFit: boolean
    aggregationSlice?: number,
}