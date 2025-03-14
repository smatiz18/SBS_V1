import { ThemeProvider } from "@mui/material/styles";
import { MatchupLinesAndStats } from "../../../../../models/matchup-lines-and-stats";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { mean, range, sliceLast, sortGameStatsObjs, sortNbaPlayerStatsObjs, stdDeviation } from "../../../../../utils/utils";
import { darkTheme, selectSx } from "../../../../../models/form-styles/styles";
import { useEffect, useState } from "react";
import QuickStatsTable from "../quick-stats-table/quick-stats-table.component";
import { BetOptions } from "../../../../../models/enums/bet-options";
import MenuItem from "@mui/material/MenuItem";
import { GameStats, NbaTeamAggGameStatsHistorical } from "../../../../../models/nba-team-agg-game-stats-historical";
import { SportsCategories } from "../../../../../models/enums/sports-categories";
import { QuickStatsCellParams } from "../../../../../models/component/quick-stats-cell-params";
import _ from "lodash";
import { GameLocationsFilter } from "../../../../../models/enums/game-locations-filter";
import AvgsFilters from "./avgs-filters/avgs-filters.component";
import { PlayerStatsObj } from "../../../../../models/nba-player-game-stats-historical";
import './avgs-table.component.scss';

const AvgsTable: React.FC<{
    matchup: MatchupLinesAndStats, 
    betOption: BetOptions,
    selectedPlayerName?: string
}> = ({matchup, betOption, selectedPlayerName}) => {
    
    /* consts ***********************************************************************/
    const TEAM_FIRST_AGG_COL_IDX = 2;
    const TEAM_SECOND_AGG_COL_IDX = 3;
    const TEAM_THIRD_AGG_COL_IDX = 4;
    const TEAM_COMP_AGG_COL_IDX = 5;    
    const TEAM_AGG_COL_IDXS = [2,3,4,5];

    const PLAYER_FIRST_AGG_COL_IDX = 1;
    const PLAYER_SECOND_AGG_COL_IDX = 2;
    const PLAYER_THIRD_AGG_COL_IDX = 3;
    const PLAYER_COMP_AGG_COL_IDX = 4;    
    const PLAYER_AGG_COL_IDXS = [1,2,3,4];

    const getColIdxToAggValMap = () => {
        let currColIdxToAggValMap: any = {};
        if (betOption === BetOptions.Team) {
            currColIdxToAggValMap[TEAM_FIRST_AGG_COL_IDX] = 3;
            currColIdxToAggValMap[TEAM_SECOND_AGG_COL_IDX] = 5;
            currColIdxToAggValMap[TEAM_THIRD_AGG_COL_IDX] = 10;
            currColIdxToAggValMap[TEAM_COMP_AGG_COL_IDX] = 20;
        } else {
            currColIdxToAggValMap[PLAYER_FIRST_AGG_COL_IDX] = 3;
            currColIdxToAggValMap[PLAYER_SECOND_AGG_COL_IDX] = 5;
            currColIdxToAggValMap[PLAYER_THIRD_AGG_COL_IDX] = 10;
            currColIdxToAggValMap[PLAYER_COMP_AGG_COL_IDX] = 20;
        }
        return currColIdxToAggValMap;
    } 

    const [colIdxToAggValMap, setColIdxToAggValMap] = useState(getColIdxToAggValMap() || {}) ;
    const [quickStatsTableRows, setQuickStatsTableRows] = useState([] as any[]);
    const [quickStatsTableColHeaders, setQuickStatsTableColHeaders] = useState([] as any[]);
    const [teamFilters, setTeamFilters] = useState({ 
        awayTeamGameLocations: GameLocationsFilter.All,
        homeTeamGameLocations: GameLocationsFilter.All
    });
    const [playerFilters, setPlayerFilters] = useState({ 
        gameLocations: GameLocationsFilter.All
    });
    
    const getAggregatableColIdx = () => {
        if (betOption === BetOptions.Team) {
            return TEAM_AGG_COL_IDXS;
        }
        return PLAYER_AGG_COL_IDXS;
    }
    const [aggregatableColIdxs, setAggregatableColIdxs] = useState(getAggregatableColIdx());
    /********************************************************************************/

    let colHeaders: any[] = [];
    let rowHeaders: any[] = [];

    const handleFilterChange = (value: any) => {
        if (betOption === BetOptions.Team) {
            const filtersUpdate = {
                ...teamFilters, 
                ...value
            };
            setTeamFilters(filtersUpdate);
        } else {
            const filtersUpdate = {
                ...playerFilters, 
                ...value
            };
            setPlayerFilters(filtersUpdate);
        }
    };

    const avgSelect = (idx: number, isComparator?: boolean) => {
        let selectOptions = range(1,20).map((o) => (
            <MenuItem value={o}>
                {`${o}g. avg`}</MenuItem>
        ));
        if (isComparator) {
            const comparatorSelectOption =  <MenuItem value='all'>All Avg</MenuItem>;
            selectOptions = selectOptions.concat([comparatorSelectOption]);
        }

        const value = colIdxToAggValMap[idx];

        return (
            <div className="select-wrapper" id={idx.toString()}>
                <ThemeProvider theme={darkTheme}>
                    <FormControl variant="standard" sx={{ width: '100%'}}>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={value === undefined ? '' : value}
                            onChange={(val: any) => updateAggValToColMap(val, idx)}
                            sx={{...selectSx, fontSize: '.7rem'}}
                        >
                            {selectOptions}
                        </Select>
                    </FormControl>
                </ThemeProvider>
            </div>
        );
    };

    const teamAvgsColHeaders = () => [
        'Team',
        'Agg', 
        avgSelect(TEAM_FIRST_AGG_COL_IDX /* idx */), 
        avgSelect(TEAM_SECOND_AGG_COL_IDX /* idx */), 
        avgSelect(TEAM_THIRD_AGG_COL_IDX /* idx */), 
        avgSelect(TEAM_COMP_AGG_COL_IDX /* idx */, true /* additional tag */), 
        'σ'
    ];
    
    const teamAvgsRowHeaders = [
        'q1',
        'q2',
        'h1',
        'q3',
        'q4',
        'h2',
        'total',
    ];

    const nbaPlayerAvgsColHeaders = () => [
        'Agg', 
        avgSelect(PLAYER_FIRST_AGG_COL_IDX /* idx */), 
        avgSelect(PLAYER_SECOND_AGG_COL_IDX /* idx */), 
        avgSelect(PLAYER_THIRD_AGG_COL_IDX /* idx */), 
        avgSelect(PLAYER_COMP_AGG_COL_IDX /* idx */, true /* additional tag */), 
        'σ'
    ];
    
    const nbaPlayerAvgsRowHeaders = [
        'Points',
        'Assists',
        'Rebounds',
        'Pts + Ass',
        'Pts + Reb',
        'Pts + Reb + Ass',
        'Threes',
        '3 Pt. %',
        'Field Goals',
        'Field Goal %',
        'Free Throws',
        'Free Throw %',
        'Steals',
        'Blocks',
        'Turnovers',
        'Plus Minus',
        'Min',
    ];
    /********************************************************************************/

    /* effects **********************************************************************/
    useEffect(() => {
        setColIdxToAggValMap(getColIdxToAggValMap());
        setAggregatableColIdxs(getAggregatableColIdx());
    }, [betOption]);

    useEffect(() => {
        initializeComponentVars();
        calculateTable();
    }, [betOption, colIdxToAggValMap, teamFilters, playerFilters, selectedPlayerName]);
    /********************************************************************************/

    const initializeComponentVars = () => {
        if (betOption === BetOptions.Team) {
            colHeaders = teamAvgsColHeaders();
            rowHeaders = teamAvgsRowHeaders; 
        } else {
            switch (matchup.sportsCategory) {
                case SportsCategories.NBA: {
                    colHeaders = nbaPlayerAvgsColHeaders();
                    rowHeaders = nbaPlayerAvgsRowHeaders;
                    break;
                }
                default: break;
            }
        }
    }

    function calculateTable(): any {
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA: {
                if (betOption === BetOptions.Team) {
                    const rows = nbaAvgTeamRows();
                    const cellMappedRows = mapRawCellsToQuickStatsTableCell(
                        rows as [][],
                        new Set(Object.keys(colIdxToAggValMap).map(k => parseInt(k)) as any), 
                        TEAM_COMP_AGG_COL_IDX,
                        (row) => row[1] === 'Sum',
                    );
                    setQuickStatsTableColHeaders(colHeaders);
                    setQuickStatsTableRows(cellMappedRows);
                } else {
                    const rows = nbaAvgPlayerRows();
                    const cellMappedRows = mapRawCellsToQuickStatsTableCell(
                        rows as [][],
                        new Set(Object.keys(colIdxToAggValMap).map(k => parseInt(k)) as any), 
                        PLAYER_COMP_AGG_COL_IDX,
                        (_) => false,
                    );
                    setQuickStatsTableColHeaders(colHeaders);
                    setQuickStatsTableRows(cellMappedRows);
                }
            }
        }
    }

    /* helpers **********************************************************************/
    const nbaAvgPlayerRows = () => {
        const playerAggStats  = matchup.playerAggGameStats || [];
        const playerStatsForAllTeams = playerAggStats.filter((currPlayerStats) => `${currPlayerStats.firstname} ${currPlayerStats.lastname}` === selectedPlayerName)
            .flatMap((currPlayerStats) => Object.values(currPlayerStats.playerStats || {}));
        const sortedAndFilteredPlayerStats = sortNbaPlayerStatsObjs(playerStatsForAllTeams)
            .filter((statsObj: PlayerStatsObj) => {
                if (playerFilters.gameLocations === GameLocationsFilter.Away) {
                    return !statsObj.isHome;
                } else if (playerFilters.gameLocations === GameLocationsFilter.Home) {
                    return statsObj.isHome;
                }
                return true;
            });
        
        return rowHeaders.map((currRow: string) => {
            switch (currRow) {
                case 'Points': {
                    const points = sortedAndFilteredPlayerStats.map(x => x.points || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Points';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(points);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && points !== undefined && slice !== 'all') {
                                return mean(sliceLast(points, slice));
                            } else if (slice === 'all') {
                                return mean(points);
                            }
                        }
                        return '-';
                    });
                }
                case 'Assists': {
                    const assists = sortedAndFilteredPlayerStats.map(x => x.assists || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Assists';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(assists);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && assists !== undefined && slice !== 'all') {
                                return mean(sliceLast(assists, slice));
                            } else if (slice === 'all') {
                                return mean(assists);
                            }
                        }
                        return '-';

                    });
                }
                case 'Rebounds': {
                    const rebounds = sortedAndFilteredPlayerStats.map(x => x.totReb || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Rebounds';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(rebounds);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && rebounds !== undefined && slice !== 'all') {
                                return mean(sliceLast(rebounds, slice));
                            } else if (slice === 'all') {
                                return mean(rebounds);
                            }
                        }
                        return '-';
                    });
                }
                case 'Pts + Ass': {
                    const ptsAss = sortedAndFilteredPlayerStats.map(x => (x.points || 0) + (x.assists || 0));
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Pts + Ass';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(ptsAss);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && ptsAss !== undefined && slice !== 'all') {
                                return mean(sliceLast(ptsAss, slice));
                            } else if (slice === 'all') {
                                return mean(ptsAss);
                            }
                        }
                        return '-';
                    });
                }
                case 'Pts + Reb': {
                    const ptsReb = sortedAndFilteredPlayerStats.map(x => (x.points || 0) + (x.totReb || 0));
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Pts + Reb';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(ptsReb);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && ptsReb !== undefined && slice !== 'all') {
                                return mean(sliceLast(ptsReb, slice));
                            } else if (slice === 'all') {
                                return mean(ptsReb);
                            }
                        }
                        return '-';
                    });
                }
                case 'Pts + Reb + Ass': {
                    const ptsRebAss = sortedAndFilteredPlayerStats.map(x => (x.points || 0) + (x.totReb || 0) + (x.assists || 0));
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Pts + Reb + Ass';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(ptsRebAss);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && ptsRebAss !== undefined && slice !== 'all') {
                                return mean(sliceLast(ptsRebAss, slice));
                            } else if (slice === 'all') {
                                return mean(ptsRebAss);
                            }
                        }
                        return '-';
                    });
                }
                case 'Threes': {
                    const threes = sortedAndFilteredPlayerStats.map(x => x.tpm || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Threes';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(threes);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && threes !== undefined && slice !== 'all') {
                                return mean(sliceLast(threes, slice));
                            } else if (slice === 'all') {
                                return mean(threes);
                            }
                        }
                        return '-';
                    });
                }
                case '3 Pt. %': {
                    const threePPct = sortedAndFilteredPlayerStats.map(x => x.tpp || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return '3 Pt. %';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(threePPct);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && threePPct !== undefined && slice !== 'all') {
                                return mean(sliceLast(threePPct, slice));
                            } else if (slice === 'all') {
                                return mean(threePPct);
                            }
                        }
                        return '-';
                    });
                }
                case 'Field Goals': {
                    const fieldGoals = sortedAndFilteredPlayerStats.map(x => x.fgm || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Field Goals';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(fieldGoals);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && fieldGoals !== undefined && slice !== 'all') {
                                return mean(sliceLast(fieldGoals, slice));
                            } else if (slice === 'all') {
                                return mean(fieldGoals);
                            }
                        }
                        return '-';
                    });
                }
                case 'Field Goal %': {
                    const fgp = sortedAndFilteredPlayerStats.map(x => x.fgp || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Field Goal %';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(fgp);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && fgp !== undefined && slice !== 'all') {
                                return mean(sliceLast(fgp, slice));
                            } else if (slice === 'all') {
                                return mean(fgp);
                            }
                        }
                        return '-';
                    });
                }
                case 'Free Throws': {
                    const freeThrows = sortedAndFilteredPlayerStats.map(x => x.ftm || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Free Throws';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(freeThrows);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && freeThrows !== undefined && slice !== 'all') {
                                return mean(sliceLast(freeThrows, slice));
                            } else if (slice === 'all') {
                                return mean(freeThrows);
                            }
                        }
                        return '-';
                    });
                }
                case 'Free Throw %': {
                    const freeThrowPct = sortedAndFilteredPlayerStats.map(x => x.ftp || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Free Throw %';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(freeThrowPct);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && freeThrowPct !== undefined && slice !== 'all') {
                                return mean(sliceLast(freeThrowPct, slice));
                            } else if (slice === 'all') {
                                return mean(freeThrowPct);
                            }
                        }
                        return '-';
                    });
                }
                case 'Steals': {
                    const steals = sortedAndFilteredPlayerStats.map(x => x.steals || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Steals';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(steals);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && steals !== undefined && slice !== 'all') {
                                return mean(sliceLast(steals, slice));
                            } else if (slice === 'all') {
                                return mean(steals);
                            }
                        }
                        return '-';
                    });
                }
                case 'Blocks': {
                    const blocks = sortedAndFilteredPlayerStats.map(x => x.blocks || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Blocks';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(blocks);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && blocks !== undefined && slice !== 'all') {
                                return mean(sliceLast(blocks, slice));
                            } else if (slice === 'all') {
                                return mean(blocks);
                            }
                        }
                        return '-';
                    });
                }
                case 'Turnovers': {
                    const turnovers = sortedAndFilteredPlayerStats.map(x => x.turnovers || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Turnovers';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(turnovers);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && turnovers !== undefined && slice !== 'all') {
                                return mean(sliceLast(turnovers, slice));
                            } else if (slice === 'all') {
                                return mean(turnovers);
                            }
                        }
                        return '-';
                    });
                }
                case 'Plus Minus': {
                    const plusMinus = sortedAndFilteredPlayerStats.map(x => x.plusMinus || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Plus Minus';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(plusMinus);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && plusMinus !== undefined && slice !== 'all') {
                                return mean(sliceLast(plusMinus, slice));
                            } else if (slice === 'all') {
                                return mean(plusMinus);
                            }
                        }
                        return '-';
                    });
                }
                case 'Min': {
                    const min = sortedAndFilteredPlayerStats.map(x => x.min || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Min';
                        } else if (colHeader === 'σ') {
                            return stdDeviation(min);
                        } else if (colHeader.props?.id !== undefined) {
                            const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                            if (slice !== undefined && min !== undefined && slice !== 'all') {
                                return mean(sliceLast(min, slice));
                            } else if (slice === 'all') {
                                return mean(min);
                            }
                        }
                        return '-';
                    });
                }
            }
        })
    }

    const nbaAvgTeamRows = () => {
        /* calculated avg columns are idx 2,3,4 std dev col is 5 */
        const teamsAggStats = [matchup.away.teamAggGameStats, matchup.home.teamAggGameStats];
        const rows = teamsAggStats.flatMap((currStats: NbaTeamAggGameStatsHistorical) => {    
            const isHome = matchup.home.teamNickname === currStats.teamNickname;
            const sortedStats = sortGameStatsObjs(Object.values(currStats.gameStats)).filter((x: GameStats) => {
                if (isHome && teamFilters.homeTeamGameLocations === GameLocationsFilter.Away) {
                    return !x.isHome;
                } else if (isHome && teamFilters.homeTeamGameLocations === GameLocationsFilter.Home) {
                    return x.isHome;
                } else if (!isHome && teamFilters.awayTeamGameLocations === GameLocationsFilter.Away) {
                    return !x.isHome;
                } else if (!isHome && teamFilters.awayTeamGameLocations === GameLocationsFilter.Home) {
                    return x.isHome;
                }
                return true;
            });
            return rowHeaders.map((currRow: string) => {
                switch (currRow) {
                    case 'Team': {
                        return currStats.teamNickname;
                    }
                    case 'q1': {
                        const q1s = sortedStats.map(x => x.linescore[0]);
                        return colHeaders.map((colHeader: any) => {
                            if (colHeader === 'Team') {
                                return currStats.teamNickname;
                            } else if (colHeader === 'Agg') {
                                return 'q1';
                            } else if (colHeader === 'σ') {
                                return stdDeviation(q1s);
                            } else if (colHeader.props?.id !== undefined) {
                                const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                                if (slice !== undefined && q1s !== undefined && slice !== 'all') {
                                    return mean(sliceLast(q1s, slice));
                                } else if (slice === 'all') {
                                    return mean(q1s);
                                }
                            }
                            return '-';
                        });
                    }
                    case 'q2': {
                        const q2s = sortedStats.map(x => x.linescore[1]);
                        return colHeaders.map((colHeader: any) => {
                            if (colHeader === 'Team') {
                                return currStats.teamNickname;
                            } else if (colHeader === 'Agg') {
                                return 'q2';
                            } else if (colHeader === 'σ') {
                                return stdDeviation(q2s);
                            } else if (colHeader.props?.id !== undefined) {
                                const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                                if (slice !== undefined && q2s !== undefined && slice !== 'all') {
                                    return mean(sliceLast(q2s, slice));
                                } else if (slice === 'all') {
                                    return mean(q2s);
                                }
                            }
                            return '-';

                        });
                    }
                    case 'h1': {
                        const h1s = sortedStats.map(x => x.linescore[0] + x.linescore[1]);
                        return colHeaders.map((colHeader: any) => {
                            if (colHeader === 'Team') {
                                return currStats.teamNickname;
                            } else if (colHeader === 'Agg') {
                                return 'h1';
                            } else if (colHeader === 'σ') {
                                return stdDeviation(h1s);
                            } else if (colHeader.props?.id !== undefined) {
                                const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                                if (slice !== undefined && h1s !== undefined && slice !== 'all') {
                                    return mean(sliceLast(h1s, slice));
                                } else if (slice === 'all') {
                                    return mean(h1s);
                                }
                            }
                            return '-';
                        });
                    }
                    case 'q3': {
                        const q3s = sortedStats.map(x => x.linescore[2]);
                        return colHeaders.map((colHeader: any) => {
                            if (colHeader === 'Team') {
                                return currStats.teamNickname;
                            } else if (colHeader === 'Agg') {
                                return 'q3';
                            } else if (colHeader === 'σ') {
                                return stdDeviation(q3s);
                            } else if (colHeader.props?.id !== undefined) {
                                const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                                if (slice !== undefined && q3s !== undefined && slice !== 'all') {
                                    return mean(sliceLast(q3s, slice));
                                } else if (slice === 'all') {
                                    return mean(q3s);
                                }
                            }
                            return '-';
                        });
                    }
                    case 'q4': {
                        const q4s = sortedStats.map(x => x.linescore[3]);
                        return colHeaders.map((colHeader: any) => {
                            if (colHeader === 'Team') {
                                return currStats.teamNickname;
                            } else if (colHeader === 'Agg') {
                                return 'q4';
                            } else if (colHeader === 'σ') {
                                return stdDeviation(q4s);
                            } else if (colHeader.props?.id !== undefined) {
                                const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                                if (slice !== undefined && q4s !== undefined && slice !== 'all') {
                                    return mean(sliceLast(q4s, slice));
                                } else if (slice === 'all') {
                                    return mean(q4s);
                                }
                            }

                            return '-';
                        });
                    }
                    case 'h2': {
                        const h2s = sortedStats.map(x => x.linescore[2] + x.linescore[3]);
                        return colHeaders.map((colHeader: any) => {
                            if (colHeader === 'Team') {
                                return currStats.teamNickname;
                            } else if (colHeader === 'Agg') {
                                return 'h2';
                            } else if (colHeader === 'σ') {
                                return stdDeviation(h2s);
                            } else if (colHeader.props?.id !== undefined) {
                                const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                                if (slice !== undefined && h2s !== undefined && slice !== 'all') {
                                    return mean(sliceLast(h2s, slice));
                                } else if (slice === 'all') {
                                    return mean(h2s);
                                }
                            }
                            return '-';
                        });
                    }
                    case 'total': {
                        const totals = sortedStats.map(x => x.points);
                        return colHeaders.map((colHeader: any) => {
                            if (colHeader === 'Team') {
                                return currStats.teamNickname;
                            } else if (colHeader === 'Agg') {
                                return 'total';
                            } else if (colHeader === 'σ') {
                                return stdDeviation(totals);
                            } else if (colHeader.props?.id !== undefined) {
                                const slice = colIdxToAggValMap[parseInt(colHeader.props?.id)];
                                if (slice !== undefined && totals !== undefined && slice !== 'all') {
                                    return mean(sliceLast(totals, slice));
                                } else if (slice === 'all') {
                                    return mean(totals);
                                }
                            }
                            return '-';
                        });
                    }
                }
            });
        });
        return sumTeamStatsAgg(rows as any, new Set(aggregatableColIdxs));
    }

    function mapRawCellsToQuickStatsTableCell(
        rows: any[][], 
        aggColIdxs: Set<number>, 
        comparatorIdx: number,
        rowAggComparator?: (x: any) => boolean,
        cellAggComparator?: (x: any) => boolean
    ): any {
        return rows.map(row => {
            const addAggToCellParams = rowAggComparator && rowAggComparator(row);
            return row.map((colVal: any, idx: number) => {
                if (aggColIdxs.has(idx) && idx !== comparatorIdx) {
                    return {
                        label: colVal,
                        positive: colVal > row[comparatorIdx],
                        negative: colVal < row[comparatorIdx],
                        aggregation: addAggToCellParams || (cellAggComparator && cellAggComparator(colVal))
                    } as QuickStatsCellParams;
                }
                return {
                    label: colVal,
                    aggregation: addAggToCellParams || (cellAggComparator && cellAggComparator(colVal))
                } as QuickStatsCellParams;
            });
        });
    }

    function updateAggValToColMap(val?: SelectChangeEvent, colIdx?: number) {
        const newColIdxToAggValMap = { ...colIdxToAggValMap };
        if (val !== undefined && colIdx !== undefined) {
            newColIdxToAggValMap[colIdx] = val.target.value;
        }
        setColIdxToAggValMap(newColIdxToAggValMap);
    }

    const sumTeamStatsAgg = (rows: [][], colIdxsToAgg: Set<number>) => {
        const aggIndex = colHeaders.findIndex((col: any) => col === 'Agg');
        const groupedRows = _.groupBy(rows, (row) => row[aggIndex]); 
        const rowsWithAggSum = Object.values(groupedRows).flatMap((aggRows) => {
            const aggSumRow = aggRows[0].map((v: any, idx: number) => {
                if (colIdxsToAgg.has(idx)) {
                    return v + aggRows[1][idx];
                }
                if (idx === aggIndex) {
                    return 'Sum'
                }
                return '-';
            });
            aggRows.push(aggSumRow as any);
            return aggRows;
        })
        return rowsWithAggSum;
    }
    /********************************************************************************/

    return (
        <div className="quick-stats-table-container" id={`${matchup.away.teamNickname}-${matchup.home.teamNickname}`}>
            <AvgsFilters handleFilterChange={handleFilterChange} betOption={betOption} matchup={matchup} selectedPlayerName={selectedPlayerName}/>
            <QuickStatsTable params={
                {
                    rows: quickStatsTableRows, 
                    headers: quickStatsTableColHeaders, 
                }
            }
            />
        </div>
    )
}
export default AvgsTable;