import { GameLocationsFilter } from "../enums/game-locations-filter";
import { GameStatsOption } from "../enums/game-stats-option";
import { QuickStatsAggregation } from "../enums/quick-stats-aggregation";
import { TeamOptionsFilter } from "../enums/team-options-filter";

export interface NbaTeamGameStatsFilters {
    id: any,
    teamFilter: TeamOptionsFilter,
    gameLocationFilter: GameLocationsFilter,
    gameStatsOption: GameStatsOption,
    showLineOfBestFit: boolean,
    showStdDeviationLines: boolean,
    showMinMaxLines: boolean,
    aggregation: QuickStatsAggregation,
    aggregationSlice: number,
    numberOfGames?: number,
}