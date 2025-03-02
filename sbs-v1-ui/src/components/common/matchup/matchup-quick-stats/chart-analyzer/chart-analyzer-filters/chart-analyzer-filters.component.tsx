import { ThemeProvider } from "@mui/material/styles";
import { accordianSummarySx, darkTheme, deleteIconSx, filterAccordianSx, subFilterAccordianSx } from "../../../../../../models/form-styles/styles";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GameLocationsFilter } from "../../../../../../models/enums/game-locations-filter";
import { GameStatsOption } from "../../../../../../models/enums/game-stats-option";
import { QuickStatsAggregation } from "../../../../../../models/enums/quick-stats-aggregation";
import { NbaTeamGameStatsFilters } from "../../../../../../models/component/nba-team-game-stats-filters";
import React, { useEffect, useState } from "react";
import { BetOptions } from "../../../../../../models/enums/bet-options";
import { Matchup } from "../../../../../../models/matchup";
import './chart-analyzer-filters.component.scss';
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import { SportsCategories } from "../../../../../../models/enums/sports-categories";
import { TeamOptionsFilter } from "../../../../../../models/enums/team-options-filter"; import { set } from "lodash";
import NbaTeamFilterOptions from "./nba-team-filter-options/nba-team-filter-options.component";
import { NbaPlayerGameStatsFilters } from "../../../../../../models/component/nba-player-game-stats-filters";
import { NbaPlayerStatsOption } from "../../../../../../models/enums/nba-player-stats-option";
import { NbaTeamsMappedByNbaApiId } from "../../../../../../constants/nba";
import NbaPlayerFilterOptions from "./nba-player-filter-options/nba-player-filter-options.component";

const ChartAnalyzerFilters: React.FC<{ 
    betOption: 
    BetOptions, 
    matchup: Matchup, 
    handleFilterChange: any,
    selectedPlayerName?: string
}> = ({ betOption, matchup, handleFilterChange, selectedPlayerName }) => {

        /* const ************************************************************************/
        const [nbaTeamGameStatsFilters, setNbaTeamGameStatsFilters] = useState([] as NbaTeamGameStatsFilters[]);
        const [nbaPlayerGameStatsFilters, setNbaPlayerGameStatsFilters] = useState([] as NbaPlayerGameStatsFilters[]);
        const [chartFilterAccordianDetails, setChartFilterAccordianDetails] = useState([] as any);
        const [nextChartFilterAccordianDetailId, setNextChartFilterAccordianDetailId] = useState(0);
        const initNbaTeamGameStatsFilter: NbaTeamGameStatsFilters = {
            id: 0,
            teamFilter: TeamOptionsFilter.Away,
            gameLocationFilter: GameLocationsFilter.All,
            gameStatsOption: GameStatsOption.total,
            aggregation: QuickStatsAggregation.Actual,
            aggregationSlice: 5,
            showLineOfBestFit: false,
            showStdDeviationLines: false,
            showMinMaxLines: false
        };

        const initNbaPlayerGameStatsFilter: NbaPlayerGameStatsFilters = {
            id: 0,
            gameLocationFilter: GameLocationsFilter.All,
            playerStatsOption: NbaPlayerStatsOption.Points,
            aggregation: QuickStatsAggregation.Actual,
            aggregationSlice: 5,
            showLineOfBestFit: false,
            showStdDeviationLines: false,
            showMinMaxLines: false
        };
        /********************************************************************************/

        /* effects **********************************************************************/
        useEffect(() => {
            initStatsFilters();
        }, [betOption, selectedPlayerName]);

        useEffect(() => {
            setChartFilterAccordianDetails(getNbaTeamFilterOptionsComponent(nbaTeamGameStatsFilters));
            handleFilterChange(nbaTeamGameStatsFilters);
        }, [nbaTeamGameStatsFilters]);

        useEffect(() => {
            setChartFilterAccordianDetails(getNbaPlayerFilterOptionsComponent(nbaPlayerGameStatsFilters));
            handleFilterChange(nbaPlayerGameStatsFilters);
        }, [nbaPlayerGameStatsFilters]);
        /********************************************************************************/

        const initStatsFilters = () => {
            switch (matchup.sportsCategory) {
                case SportsCategories.NBA: {
                    if (betOption === BetOptions.Team) {
                        setNbaTeamGameStatsFilters([{ ...initNbaTeamGameStatsFilter }]);
                    } else {
                        setNbaPlayerGameStatsFilters([{...initNbaPlayerGameStatsFilter}]);
                    }
                    break;
                }
                default:
                    break;
            }
        }

        /* utils ************************************************************************/
        const updateObjInVecById = (vec: any[], id: any, objValuePath: string, value: any) => {
            return vec.map((obj) => {
                if (obj.id === id) {
                    set(obj, objValuePath, value);
                }
                return obj;
            });
        };

        const getNextAccordianDetailsId = () => {
            const nextId = nextChartFilterAccordianDetailId + 1;
            setNextChartFilterAccordianDetailId(nextId);
            return nextId;
        }

        const getNbaTeamFilterAccordianSummaryLabel = (filter: NbaTeamGameStatsFilters) => {
            const teamNickname = filter.teamFilter === TeamOptionsFilter.Away ? matchup.away.teamNickname : matchup.home.teamNickname;
            const numOfGames = filter.numberOfGames === undefined || filter.numberOfGames as any === 'all' ?
                'all' :
                `last ${filter.numberOfGames}`;
            const gameLocation = `${filter.gameLocationFilter === GameLocationsFilter.All ? '' : filter.gameLocationFilter} games`;
            const includeAggregation = filter.aggregation !== QuickStatsAggregation.Actual;
            const aggregation = `${filter.aggregation.replace(/([a-z])([A-Z])/g, "$1 $2")}${filter.aggregation === QuickStatsAggregation.RollingAverage ? `(${filter.aggregationSlice})` : ''}`;
            return `${teamNickname}: ${`${numOfGames} ${gameLocation} ${filter.gameStatsOption} ${includeAggregation ? aggregation : ''} points`.toLowerCase()} (${filter.id})`;
        };

        const getNbaPlayerFilterAccordianSummaryLabel = (filter: NbaPlayerGameStatsFilters) => {
            const numOfGames = filter.numberOfGames === undefined || filter.numberOfGames as any === 'all' ?
                'all' :
                `last ${filter.numberOfGames}`;
            const gameLocation = `${filter.gameLocationFilter === GameLocationsFilter.All ? '' : filter.gameLocationFilter} games`;
            const includeAggregation = filter.aggregation !== QuickStatsAggregation.Actual;
            const aggregation = `${filter.aggregation.replace(/([a-z])([A-Z])/g, "$1 $2")}${filter.aggregation === QuickStatsAggregation.RollingAverage ? `(${filter.aggregationSlice})` : ''}`;
            const teamFilter = filter.teamIdFilter !== undefined ? NbaTeamsMappedByNbaApiId[filter.teamIdFilter as any].teamNickname : '';
            return `${selectedPlayerName}: ${`${numOfGames} ${teamFilter} ${gameLocation} ${includeAggregation ? aggregation : ''} ${filter.playerStatsOption}`.toLowerCase()} (${filter.id})`;
        }
        /********************************************************************************/

        /* handlers *********************************************************************/
        const handleNbaTeamGameStatsFiltersUpdate = (params: {
            id: any,
            valuePath: string,
            value: any
        }) => {
            setNbaTeamGameStatsFilters((nbaTeamGameStatsFilters: NbaTeamGameStatsFilters[]) => {
                const updatedFilters = updateObjInVecById(nbaTeamGameStatsFilters, params.id, params.valuePath, params.value);
                return updatedFilters;
            });
        };

        const handleNbaPlayerGameStatsFiltersUpdate = (params: {
            id: any,
            valuePath: string,
            value: any
        }) => {
            setNbaPlayerGameStatsFilters((nbaPlayerGameStatsFilters: NbaPlayerGameStatsFilters[]) => {
                const updatedFilters = updateObjInVecById(nbaPlayerGameStatsFilters, params.id, params.valuePath, params.value);
                return updatedFilters;
            });
        };

        const addNewChartDataSet = () => {
            const newId = getNextAccordianDetailsId();
            setNbaTeamGameStatsFilters((nbaTeamGameStatsFilters: NbaTeamGameStatsFilters[]) => {
                const newFilters = [
                    ...nbaTeamGameStatsFilters,
                    {
                        ...initNbaTeamGameStatsFilter,
                        id: newId
                    }
                ];
                return newFilters;
            });
        }

        const onDelete = (id: any) => {
            setNbaTeamGameStatsFilters((nbaTeamGameStatsFilters: NbaTeamGameStatsFilters[]) => {
                return nbaTeamGameStatsFilters.filter((x: any) => x.id !== id);
            });
        };
        /********************************************************************************/

        /* helpers **********************************************************************/
        const getNbaPlayerFilterOptionsComponent = (nbaPlayerGameStatsFilters: NbaPlayerGameStatsFilters[]) => {
            return nbaPlayerGameStatsFilters.map((filter, idx) => (
                <Accordion sx={subFilterAccordianSx} id={filter.id} defaultExpanded={idx === 0}>
                    <div className="accordian-summary-header">
                        <div className="summary-wrapper">
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                sx={accordianSummarySx}
                            >
                                {getNbaPlayerFilterAccordianSummaryLabel(filter)}
                            </AccordionSummary>
                        </div>
                        <div className="delete-icon-wrapper">
                            <DeleteIcon sx={deleteIconSx} onClick={() => onDelete(filter.id)} />
                        </div>
                    </div>
                    <AccordionDetails>
                        <NbaPlayerFilterOptions
                            matchup={matchup}
                            id={filter.id}
                            nbaPlayerGameStatsFiltersObj={filter}
                            handleNbaPlayerGameStatsFiltersUpdate={handleNbaPlayerGameStatsFiltersUpdate}
                            selectedPlayerName={selectedPlayerName}
                        />
                    </AccordionDetails>
                </Accordion>
            ));
        };

        const getNbaTeamFilterOptionsComponent = (nbaTeamGameStatsFilters: NbaTeamGameStatsFilters[]) => {
            return nbaTeamGameStatsFilters.map((filter, idx) => (
                <Accordion sx={subFilterAccordianSx} id={filter.id} defaultExpanded={idx === 0}>
                    <div className="accordian-summary-header">
                        <div className="summary-wrapper">
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                sx={accordianSummarySx}
                            >
                                {getNbaTeamFilterAccordianSummaryLabel(filter)}
                            </AccordionSummary>
                        </div>
                        <div className="delete-icon-wrapper">
                            <DeleteIcon sx={deleteIconSx} onClick={() => onDelete(filter.id)} />
                        </div>
                    </div>
                    <AccordionDetails>
                        <NbaTeamFilterOptions
                            matchup={matchup}
                            id={filter.id}
                            nbaTeamGameStatsFiltersObj={filter}
                            handleNbaTeamGameStatsFiltersUpdate={handleNbaTeamGameStatsFiltersUpdate}
                        />
                    </AccordionDetails>
                </Accordion>
            ));
        };
        /********************************************************************************/

        return (
            <div className="chart-analyzer-filters-container">
                <ThemeProvider theme={darkTheme}>
                    <Accordion sx={filterAccordianSx} defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            sx={accordianSummarySx}
                        >
                            Filters
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="accordian-details-wrapper">
                                {chartFilterAccordianDetails}
                            </div>
                        </AccordionDetails>
                        {
                            chartFilterAccordianDetails.length < 4 && (
                                <div className="button-wrapper">
                                    <AccordionDetails>
                                        <Button variant="outlined" size="small" onClick={addNewChartDataSet}>+</Button>
                                    </AccordionDetails>
                                </div>
                            )
                        }
                    </Accordion>
                </ThemeProvider>
            </div>
        );
    }

export default ChartAnalyzerFilters;