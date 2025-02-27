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
import './avgs-table.component.scss';

const AvgsTable: React.FC<{
    matchup: MatchupLinesAndStats, 
    betOption: BetOptions,
    selectedPlayerName?: string
}> = ({matchup, betOption, selectedPlayerName}) => {
    
    /* consts ***********************************************************************/
    const FIRST_AGG_COL_IDX = 2;
    const SECOND_AGG_COL_IDX = 3;
    const THIRD_AGG_COL_IDX = 4;
    const COMP_AGG_COL_IDX = 5;    
    const AGG_COL_IDXS = [2,3,4,5];

    const initColIdxToAggValMap: Record<number, any> = {};
    initColIdxToAggValMap[FIRST_AGG_COL_IDX] = 3;
    initColIdxToAggValMap[SECOND_AGG_COL_IDX] = 5;
    initColIdxToAggValMap[THIRD_AGG_COL_IDX] = 10;
    initColIdxToAggValMap[COMP_AGG_COL_IDX] = 20;
    
    const [quickStatsTableRows, setQuickStatsTableRows] = useState([] as any[]);
    const [quickStatsTableColHeaders, setQuickStatsTableColHeaders] = useState([] as any[]);
    const [colIdxToAggValMap, setColIdxToAggValMap] = useState(initColIdxToAggValMap);
    const [teamFilters, setTeamFilters] = useState({ 
        away: GameLocationsFilter.All,
        home: GameLocationsFilter.All
    });
    const aggregatableColIdxs = AGG_COL_IDXS;

    let colHeaders: any[] = [];
    let rowHeaders: any[] = [];

    const handleFilterChange = (value: any) => {
        const filtersUpdate = {
            ...teamFilters, 
            ...value
        };
        setTeamFilters(filtersUpdate);
    };

    const avgSelect = (idx: number, isComparator?: boolean) => {
        let selectOptions = range(1,20).map((o) => (
            <MenuItem value={o}>
                {`${o} game avg`}</MenuItem>
        ));
        if (isComparator) {
            const comparatorSelectOption =  <MenuItem value='all'>All Avg</MenuItem>;
            selectOptions = selectOptions.concat([comparatorSelectOption]);
        }

        return (
            <div className="select-wrapper" id={idx.toString()}>
                <ThemeProvider theme={darkTheme}>
                    <FormControl variant="standard" sx={{ width: '100%'}}>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={colIdxToAggValMap[idx]}
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

    const teamAvgsColHeaders = [
        'Team',
        'Agg', 
        avgSelect(FIRST_AGG_COL_IDX /* idx */), 
        avgSelect(SECOND_AGG_COL_IDX /* idx */), 
        avgSelect(THIRD_AGG_COL_IDX /* idx */), 
        avgSelect(COMP_AGG_COL_IDX /* idx */, true /* additional tag */), 
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

    const nbaPlayerAvgsColHeaders = [
        'Agg', 
        avgSelect(FIRST_AGG_COL_IDX /* idx */), 
        avgSelect(SECOND_AGG_COL_IDX /* idx */), 
        avgSelect(THIRD_AGG_COL_IDX /* idx */), 
        avgSelect(COMP_AGG_COL_IDX /* idx */, true /* additional tag */), 
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
    ];
    /********************************************************************************/

    /* effects **********************************************************************/
    useEffect(() => {
        initializeComponentVars();
        calculateTable();
    }, [betOption, colIdxToAggValMap, teamFilters]);
    /********************************************************************************/

    const initializeComponentVars = () => {
        if (betOption === BetOptions.Team) {
            colHeaders = teamAvgsColHeaders;
            rowHeaders = teamAvgsRowHeaders; 
        } else {
            switch (matchup.sportsCategory) {
                case SportsCategories.NBA: {
                    colHeaders = nbaPlayerAvgsColHeaders;
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
                        COMP_AGG_COL_IDX,
                        (row) => row[1] === 'Sum',
                    );
                    setQuickStatsTableColHeaders(colHeaders);
                    setQuickStatsTableRows(cellMappedRows);
                } else {
                    const rows = nbaAvgPlayerRows();
                    console.log("PLAYER ROWS");
                    const cellMappedRows = mapRawCellsToQuickStatsTableCell(
                        rows as [][],
                        new Set(Object.keys(colIdxToAggValMap).map(k => parseInt(k)) as any), 
                        COMP_AGG_COL_IDX,
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
        
        console.log('PLAYER STATS', playerAggStats);

        const playerStats = playerAggStats.find((currPlayerStats) => `${currPlayerStats.firstname} ${currPlayerStats.lastname}` === selectedPlayerName);
        // add player home / away filters
        const sortedPlayerStats = sortNbaPlayerStatsObjs(Object.values(playerStats?.playerStats || {}));
        return rowHeaders.map((currRow: string) => {
            switch (currRow) {
                case 'Points': {
                    const points = sortedPlayerStats.map(x => x.points || 0);
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
                    const assists = sortedPlayerStats.map(x => x.assists || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Points';
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
                    const rebounds = sortedPlayerStats.map(x => x.totReb || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Points';
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
                    const ptsAss = sortedPlayerStats.map(x => (x.points || 0) + (x.assists || 0));
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Points';
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
                    const ptsReb = sortedPlayerStats.map(x => (x.points || 0) + (x.totReb || 0));
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Points';
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
                    const ptsRebAss = sortedPlayerStats.map(x => (x.points || 0) + (x.totReb || 0) + (x.assists || 0));
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Points';
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
                    const threes = sortedPlayerStats.map(x => x.tpm || 0);
                    return colHeaders.map((colHeader: any) => {
                        if (colHeader === 'Agg') {
                            return 'Points';
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
            }
        })
    }

    const nbaAvgTeamRows = () => {
        /* calculated avg columns are idx 2,3,4 std dev col is 5 */
        const teamsAggStats = [matchup.away.teamAggGameStats, matchup.home.teamAggGameStats];
        const rows = teamsAggStats.flatMap((currStats: NbaTeamAggGameStatsHistorical) => {    
            const isHome = matchup.home.teamNickname === currStats.teamNickname;
            const sortedStats = sortGameStatsObjs(Object.values(currStats.gameStats)).filter((x: GameStats) => {
                if (isHome && teamFilters.home === GameLocationsFilter.Away) {
                    return !x.isHome;
                } else if (isHome && teamFilters.home === GameLocationsFilter.Home) {
                    return x.isHome;
                } else if (!isHome && teamFilters.away === GameLocationsFilter.Away) {
                    return !x.isHome;
                } else if (!isHome && teamFilters.away === GameLocationsFilter.Home) {
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
            <AvgsFilters handleFilterChange={handleFilterChange} betOption={betOption} matchup={matchup}/>
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