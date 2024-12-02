import { useEffect, useState } from "react";
import { BetOptions } from "../../../models/enums/bet-options";
import { MatchupLinesAndStats } from "../../../models/matchup-lines-and-stats";
import './matchup-quick-stats.component.scss';
import { QuickStatsAggregation } from "../../../models/enums/quick-stats-aggregation";
import { SeasonType } from "../../../models/enums/season-type";
import { QuickStatsCellParams } from "../../../models/component/quick-stats-cell-params";
import { SportsCategories } from "../../../models/enums/sports-categories";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { selectSx } from "../../../models/form-styles/styles";
import { GameStats, NbaTeamAggGameStatsHistorical } from "../../../models/nba-team-agg-game-stats-historical";
import QuickStatsTable from "../quick-stats-table/quick-stats-table.component";

const MatchupQuickStats: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    const FIRST_AGG_COL_IDX = 2;
    const SECOND_AGG_COL_IDX = 3;
    const THIRD_AGG_COL_IDX = 4;
    const ALL_COL_IDX = 5
    let aggToColIdxMap: Record<number, number> = {};
    aggToColIdxMap[FIRST_AGG_COL_IDX] = 3;
    aggToColIdxMap[SECOND_AGG_COL_IDX] = 5;
    aggToColIdxMap[THIRD_AGG_COL_IDX] = 10;

    const [betOption, setBetOption] = useState(BetOptions.Team); 
    const [quickStatsAgg, setQuickStatsAgg] = useState(QuickStatsAggregation.Averages);
    const [quickStatsTableRows, setQuickStatsTableRows] = useState([] as any[]);
    const [seasonType, setSeasonType] = useState(SeasonType.All);
    const [aggsValToColMap, setAggsValToColMap] = useState(aggToColIdxMap);
    const [quickStatsTableHeaders, setQuickStatsTableHeaders] = useState([] as any[]);
    let colHeaders: any[] = [];
    let rowHeaders: any[] = [];
    
    /** init api calls */
    useEffect(() => {   
        calculateTable();
    }, []); 

    useEffect(() => {
        calculateTable();
    }, [aggsValToColMap]);

    const mean = (vec: number[]) => vec.reduceRight((prev: number, curr: number) => prev + curr, 0) / vec.length;
    
    const sliceLast = (vec: number[], slice: number) => vec.slice(vec.length - slice); 
    
    const sliceFirst = (vec: number[], slice: number) => vec.slice(0, slice);  
    
    const stdDeviation = (vec: number[]) => {
        if (vec.length === 0) return 0;
        const mean = vec.reduce((acc, num) => acc + num, 0) / vec.length;
        const squaredDiffs = vec.map(num => Math.pow(num - mean, 2));
        const variance = squaredDiffs.reduce((acc, diff) => acc + diff, 0) / vec.length;
        return Math.sqrt(variance);
    }
    
    const sortGameStatsObjs = (stats: GameStats[]) => {
        return stats.sort((a, b) => Date.parse(a.dateStart) - Date.parse(b.dateStart));
    }
    
    const range = (start: number, end: number): number[] => {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };
    
    const avgSelect = (idx: number) => (
        <div className="select-wrapper" id={idx.toString()}>
            <FormControl variant="standard" sx={{ width: '100%'}}>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={aggsValToColMap[idx]}
                    onChange={(val: any) => updateAggValToColMap(val, idx)}
                    sx={{...selectSx, fontSize: '.75rem'}}
                >
                    {
                        range(1,20).map((o) => (
                            <MenuItem value={o}>{`${o} Avg`}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </div>
    );
    
    const initAvgsColHeaders = () => [
        'Team',
        'Agg', 
        avgSelect(FIRST_AGG_COL_IDX /* idx */), 
        avgSelect(SECOND_AGG_COL_IDX /* idx */), 
        avgSelect(THIRD_AGG_COL_IDX /* idx */), 
        'All',
        'σ'
    ];
    
    const initTeamAvgsRowHeaders = () => [
        'q1',
        'q2',
        'h1',
        'q3',
        'q4',
        'h2',
        'total',
    ];
    
    const nbaAvgTeamRows = () => {
        /* calculated avg columns are idx 2,3,4 std dev col is 5 */

        const teamsAggStats = [matchup.away.teamAggGameStats, matchup.home.teamAggGameStats];
        const rows = teamsAggStats.flatMap((currStats: NbaTeamAggGameStatsHistorical) => {    
            const sortedStats = sortGameStatsObjs(Object.values(currStats.gameStats));
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
                            } else if (colHeader === 'All') {
                                return mean(q1s);
                            } else if (colHeader.props.id !== undefined) {
                                const slice = aggsValToColMap[parseInt(colHeader.props.id)];
                                if (slice !== undefined && q1s !== undefined) {
                                    return mean(sliceLast(q1s, slice));
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
                            } else if (colHeader === 'All') {
                                return mean(q2s);
                            } else if (colHeader.props.id !== undefined) {
                                const slice = aggsValToColMap[parseInt(colHeader.props.id)];
                                if (slice !== undefined && q2s !== undefined) {
                                    return mean(sliceLast(q2s, slice));
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
                            } else if (colHeader === 'All') {
                                return mean(h1s);
                            } else if (colHeader.props.id !== undefined) {
                                const slice = aggsValToColMap[parseInt(colHeader.props.id)];
                                if (slice !== undefined && h1s !== undefined) {
                                    return mean(sliceLast(h1s, slice));
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
                            } else if (colHeader === 'All') {
                                return mean(q3s);
                            } else if (colHeader.props.id !== undefined) {
                                const slice = aggsValToColMap[parseInt(colHeader.props.id)];
                                if (slice !== undefined && q3s !== undefined) {
                                    return mean(sliceLast(q3s, slice));
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
                            } else if (colHeader === 'All') {
                                return mean(q4s);
                            } else if (colHeader.props.id !== undefined) {
                                const slice = aggsValToColMap[parseInt(colHeader.props.id)];
                                if (slice !== undefined && q4s !== undefined) {
                                    return mean(sliceLast(q4s, slice));
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
                            } else if (colHeader === 'All') {
                                return mean(h2s);
                            } else if (colHeader.props.id !== undefined) {
                                const slice = aggsValToColMap[parseInt(colHeader.props.id)];
                                if (slice !== undefined && h2s !== undefined) {
                                    return mean(sliceLast(h2s, slice));
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
                            } else if (colHeader === 'All') {
                                return mean(totals);
                            } else if (colHeader.props.id !== undefined) {
                                const slice = aggsValToColMap[parseInt(colHeader.props.id)];
                                if (slice !== undefined && totals !== undefined) {
                                    return mean(sliceLast(totals, slice));
                                }
                            }
                            return '-';
                        });
                    }
                }
            });
        });
        return rows;
    }

    function updateAggValToColMap(val?: SelectChangeEvent, colIdx?: number) {
        let newaggsValToColMap = { ...aggsValToColMap };
        if (val !== undefined && colIdx !== undefined) {
            newaggsValToColMap[colIdx] = parseInt(val.target.value);
        }
        setAggsValToColMap(newaggsValToColMap);
    }

    function calculateTable(): any {
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA: {
                if (betOption === BetOptions.Team) {
                    switch (quickStatsAgg) {
                        case QuickStatsAggregation.Averages: {
                            if (!colHeaders || colHeaders.length === 0) {
                                colHeaders = initAvgsColHeaders();
                                rowHeaders = initTeamAvgsRowHeaders();
                            }
                            const rows = nbaAvgTeamRows();
                            console.log('ROWS: ', rows);
                            const cellMappedRows = mapRawCellsToQuickStatsTableCell(
                                rows as [][],
                                new Set(Object.keys(aggsValToColMap).map(k => parseInt(k)) as any), 
                                ALL_COL_IDX
                            );
                            setQuickStatsTableHeaders(colHeaders);
                            setQuickStatsTableRows(cellMappedRows);
                        }
                    }
                }
            }
        }
    }

    function mapRawCellsToQuickStatsTableCell(rows: any[][], aggColIdxs: Set<number>, comparatorIdx: number): any {
        return rows.map(row => (
            row.map((colVal: any, idx: number) => {
                if (aggColIdxs.has(idx)) {
                    return {
                        label: colVal,
                        positive: colVal > row[comparatorIdx],
                        negative: colVal < row[comparatorIdx],
                    } as QuickStatsCellParams;
                }
                return {
                    label: colVal
                } as QuickStatsCellParams;
            })
        ));
    }
    



    // function getGamesStatsPeriodValue(obj: GameStats) {
    //     switch (gamePeriod) {
    //         case GamePeriods.Total: 
    //             return obj.points;
    //         case GamePeriods.FirstHalf:
    //             return obj.linescoreQ1 + obj.linescoreQ2;
    //         case GamePeriods.SecondHalf:
    //             return obj.linescoreQ3 + obj.linescoreQ4;
    //         case GamePeriods.Q1:
    //             return obj.linescoreQ1;
    //         case GamePeriods.Q2:
    //             return obj.linescoreQ2;
    //         case GamePeriods.Q3:
    //             return obj.linescoreQ3;
    //         case GamePeriods.Q4:
    //             return obj.linescoreQ4;
    //         default:
    //             return 0; 
    //     }
    // }

    function aggregateTotals(arrs: any[][], idxs: number[]) {
        let aggRow = new Array(arrs[0].length).fill('-');

        idxs.forEach((idx: number) => {
            aggRow[idx] = 0;
            arrs.forEach((arr: any[]) => {
                if (!isNaN(arr[idx]?.label || '')) {
                    aggRow[idx] += arr[idx].label; 
                }
            });
        });
        aggRow[0] = 'Aggregation';

        aggRow = aggRow.map((agg) => ({ label: agg, aggregation: true } as QuickStatsCellParams));
        return aggRow; 
    }
    
    async function setQuickStatsTable() {
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA: {
                if (betOption === BetOptions.Team) {
                    switch (quickStatsAgg) {
                        case QuickStatsAggregation.Averages:
                            // const awayTeamId = NbaTeamsMappedByNickname[matchup.away.teamNickname].nbaApiId;
                            // const homeTeamId = NbaTeamsMappedByNickname[matchup.home.teamNickname].nbaApiId;
                            // const req: GetNbaTeamAggGameStatsRequest = {
                            //     teamIds: [awayTeamId, homeTeamId],
                            //     season: 2024,
                            //     seasonType: SeasonType.Regular
                            // };
                            // const gameStatsAvgs = await getNbaGameStatsAvgs(req);
                            // const awayTeamAvgs = gameStatsAvgs.data.gameStatsAvgs[awayTeamId];
                            // const homeTeamAvgs = gameStatsAvgs.data.gameStatsAvgs[homeTeamId];
                            // const awayTeamAvgsRow = mapNbaGameStatsAvgsQuickStatsToQuickStatsTableRowCells(awayTeamAvgs) || [];
                            // const homeTeamAvgsRow = mapNbaGameStatsAvgsQuickStatsToQuickStatsTableRowCells(homeTeamAvgs) || [];
                            // const aggregatedTotalsRow = aggregateTotals([awayTeamAvgsRow, homeTeamAvgsRow], [1,2,3]);
                            // setQuickStatsTableRows([
                            //     awayTeamAvgsRow,
                            //     homeTeamAvgsRow,
                            //     aggregatedTotalsRow
                            // ]);
                            // setQuickStatsTableHeaders(getTeamStatsAvgTableHeaders);
                            break;
                        case QuickStatsAggregation.Probabilities:
                            setQuickStatsTableRows([]);
                            break;
                        default: 
                            setQuickStatsTableRows([]);
                            break;
                    }
                }
            }
        }
    }

    return (
        <div className="matchup-quick-stats-component-container">
            <div className="quick-stats-container">
                <div className="header-container">
                    <h3>Quick Stats</h3>
                    <div className="line"></div>
                </div>
                <div className="quick-stats-table-container">
                    <QuickStatsTable params={
                        {
                            rows: quickStatsTableRows, 
                            headers: quickStatsTableHeaders, 
                        }
                    }
                    />
                </div>
            </div>
        </div>
    )
}

export default MatchupQuickStats;