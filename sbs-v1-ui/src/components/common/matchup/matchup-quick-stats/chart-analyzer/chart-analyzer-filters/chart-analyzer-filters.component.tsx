import { ThemeProvider } from "@mui/material/styles";
import { accordianSummarySx, chartAnalyzerDeleteIconSx, checkboxFormControlLabelSx, darkTheme, filterAccordianSx, formLabelSx, radioIconSx, radioLabelSx, selectSx, subFilterAccordianSx } from "../../../../../../models/form-styles/styles";
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
import { TeamOptionsFilter } from "../../../../../../models/enums/team-options-filter";import { set } from "lodash";
import NbaTeamFilterOptions from "./nba-team-filter-options/nba-team-filter-options.component";

const ChartAnalyzerFilters: React.FC<{betOption: BetOptions, matchup: Matchup, handleFilterChange: any}> = 
    ({betOption, matchup, handleFilterChange}) => {
    
    /* const ************************************************************************/
    const [nbaTeamGameStatsFilters, setNbaTeamGameStatsFilters] = useState([] as NbaTeamGameStatsFilters[]);
    const [chartFilterAccordianDetails, setChartFilterAccordianDetails] = useState([] as any);
    const [nextChartFilterAccordianDetailId, setNextChartFilterAccordianDetailId] = useState(-1);
    const initNbaTeamGameStatsComparatorFilter: NbaTeamGameStatsFilters = {
        id: 'comparator',
        teamFilter: TeamOptionsFilter.Away,
        gameLocationFilter: GameLocationsFilter.All,
        gameStatsOption: GameStatsOption.total,
        aggregation: QuickStatsAggregation.Actual,
        lineOfBestFit: false,
        isComparator: true,
    };
    const initNbaTeamGameStatsAdditionalStatsFilter: NbaTeamGameStatsFilters = {
        ...initNbaTeamGameStatsComparatorFilter,
        id: undefined,
        isComparator: false
    };
    /********************************************************************************/

    /* effects **********************************************************************/ 
    useEffect(() => {
        initNbaTeamGameStatsFilters();
    }, []);

    useEffect(() => {
        setChartFilterAccordianDetails(getNbaTeamFilterOptionsComponent(nbaTeamGameStatsFilters));
        handleFilterChange(nbaTeamGameStatsFilters);
    }, [nbaTeamGameStatsFilters]);
    /********************************************************************************/

    const initNbaTeamGameStatsFilters = () => {
        if (betOption === BetOptions.Team) {
            switch (matchup.sportsCategory) {
                case SportsCategories.NBA: {
                    setNbaTeamGameStatsFilters([{...initNbaTeamGameStatsComparatorFilter}]);
                    break;
                }
            }
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
        const aggregationSlice = filter.aggregationSlice === undefined || filter.aggregationSlice as any === 'all' ? 
            'all' : 
            `last ${filter.aggregationSlice}`;
        const gameLocation = `${filter.gameLocationFilter === GameLocationsFilter.All ? '' : filter.gameLocationFilter} games`;
        const includeAggregation = filter.aggregation !== QuickStatsAggregation.Actual;
        return`${teamNickname}: ${`${aggregationSlice} ${gameLocation} ${filter.gameStatsOption} ${includeAggregation ? filter.aggregation.replace(/([a-z])([A-Z])/g, "$1 $2") : ''} points`.toLowerCase()}`;
    };
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

    const addNewChartDataSet = () => {
        const newId = getNextAccordianDetailsId();
        setNbaTeamGameStatsFilters((nbaTeamGameStatsFilters: NbaTeamGameStatsFilters[]) => {
            const newFilters = [
                ...nbaTeamGameStatsFilters,   
                {
                    ...initNbaTeamGameStatsAdditionalStatsFilter,
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
    const getNbaTeamFilterOptionsComponent = (nbaTeamGameStatsFilters: NbaTeamGameStatsFilters[]) => (
        nbaTeamGameStatsFilters.map((filter) => (
            <Accordion sx={subFilterAccordianSx} id={filter.id}>
                <div className="accordian-summary-header">
                    <div className="summary-wrapper">
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            sx={accordianSummarySx}
                        >
                            {filter.isComparator ? 'Comparator' : getNbaTeamFilterAccordianSummaryLabel(filter) }
                        </AccordionSummary>
                    </div>
                    {
                        !filter.isComparator && (
                            <div className="delete-icon-wrapper">
                            <DeleteIcon sx={chartAnalyzerDeleteIconSx} onClick={() => onDelete(filter.id)}/>
                            </div>
                        )
                    }
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
        ))
    );
    /********************************************************************************/

    return (
        <div className="chart-analyzer-filters-container">
            <ThemeProvider theme={darkTheme}>
                <Accordion sx={filterAccordianSx}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
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
                    <AccordionDetails>
                        <Button variant="outlined" size="small" onClick={addNewChartDataSet}>+</Button>
                    </AccordionDetails>
                </Accordion>
            </ThemeProvider>
        </div>
    );
}

export default ChartAnalyzerFilters;