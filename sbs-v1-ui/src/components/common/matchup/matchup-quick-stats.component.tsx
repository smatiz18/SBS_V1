import { useEffect, useState } from "react";
import { BetOptions } from "../../../models/enums/bet-options";
import { MatchupLinesAndStats } from "../../../models/matchup-lines-and-stats";
import './matchup-quick-stats.component.scss';
import { QuickStatsAggregation } from "../../../models/enums/quick-stats-aggregation";
import { GetNbaTeamAggGameStatsRequest } from "../../../models/services/get-nba-team-agg-game-stats-request";
import { NbaTeamsMappedByNickname } from "../../../constants/nba";
import { SeasonType } from "../../../models/enums/season-type";
import { GamePeriods } from "../../../models/enums/game-periods";
import QuickStatsTable from "../quick-stats-table/quick-stats-table.component";
import { QuickStatsCellParams } from "../../../models/component/quick-stats-cell-params";
import { getNbaTeamAggGameStats } from "../../../services/nba/services";
import { GameStats, GetNbaTeamAggGameStatsResponse, NbaTeamAggGameStatsHistorical } from "../../../models/services/get-nba-team-agg-game-stats-response";
import { SportsCategories } from "../../../models/enums/sports-categories";
import { match } from "assert";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { selectSx } from "../../../models/form-styles/styles";

const MatchupQuickStats: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    const [betOption, setBetOption] = useState(BetOptions.Team); 
    const [quickStatsAgg, setQuickStatsAgg] = useState(QuickStatsAggregation.Averages);
    const [quickStatsTableRows, setQuickStatsTableRows] = useState([] as any[]);
    const [quickStatsTableHeaders, setQuickStatsTableHeaders] = useState([] as any[]);
    const [seasonType, setSeasonType] = useState(SeasonType.All);
    const [stats, setStats] = useState({} as Record<any, NbaTeamAggGameStatsHistorical>)
    const [colHeaders, setColHeaders] = useState([] as any[]);
    const [rowHeaders, setRowHeaders] = useState([] as any[]); 
    const [avgsValToColMap, setAvgsValToColMap] = useState({1: 3, 2: 5, 3: 10 } as any);
    
    /** init api calls */
    useEffect(() => {    
        const _ = async () => {
            await initQuickStatsData();
            setQuickStatsTable();
        }
    }, []);

    async function initQuickStatsData() {
        let requestedStats = {};
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA: {
                if (betOption === BetOptions.Team) {
                    const req: GetNbaTeamAggGameStatsRequest = {
                        teamIds: [matchup.away.teamStats._id, matchup.home.teamStats._id],
                        season: [matchup.home.teamStats.season],
                        seasonType: seasonType
                    };
                    requestedStats = (await getNbaTeamAggGameStats(req)).data.aggGameStats;
                }
            }
        }
        setStats(requestedStats);
    }

    const mean = (vec: number[]) => vec.reduceRight((prev: number, curr: number) => prev + curr, 0) / vec.length;
    const sliceLast = (vec: number[], slice: number) => vec.slice(vec.length - slice); 
    const sliceFirst = (vec: number[], slice: number) => vec.slice(0, slice);
    const range = (start: number, end: number): number[] => {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };
    const avgSelect = (initVal: number, idx: number) => (
        <div className="select-wrapper" id={idx.toString()}>
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={initVal}
                    onChange={(val: any) => calculateTable(val, idx)}
                    sx={selectSx}
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
        '', 
        avgSelect(3 /* initVal */, 1 /* idx */), 
        avgSelect(5 /* initVal */, 2 /* idx */), 
        avgSelect(10 /* initVal */, 3 /* idx */), 
        'σ'
    ];
    const initAvgsRowHeaders = () => [
        'team',
        'q1',
        'q2',
        'h1',
        'q3',
        'q4',
        'h2',
        'total',
    ];
    const nbaAvgTeamRows = () => {
        /* calculated avg columns are idx 1,2,3 std dev col is 4 */
        Nbamatchup.home.teamName
        const awayStats = stats[]
        const homeStats = 
        const calculatedAvgsCols = colHeaders.filter((colH) => colH.props?.id !== undefined)
            .reduce((prev, curr: Nba) => {
                
                prev[curr.props.id] =                
            }, {}); 
        calc
        
    }


    function calculateTable(val: SelectChangeEvent, colIdx?: number): any {
        let newAvgsValToColMap = { ...avgsValToColMap };
        if (colIdx !== undefined) {
            newAvgsValToColMap[colIdx] = val.target.value;
        }
        setAvgsValToColMap(newAvgsValToColMap);
        let rows;
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA: {
                if (betOption === BetOptions.Team) {
                    switch (quickStatsAgg) {
                        case QuickStatsAggregation.Averages: {
                            if (!colHeaders || colHeaders.length === 0) {
                                setColHeaders(initAvgsColHeaders());
                                setRowHeaders(initAvgsRowHeaders());
                            }
                            rows = nbaAvgTeamRows();       
                        }
                    }
                }
            }
        }
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

    function sortGameStatsObjs(stats: GameStats[]) {
        return stats.sort((a, b) => Date.parse(a.dateStart) - Date.parse(b.dateStart));
    }

    // function getStdDeviation(nums: number[]) {
    //     if (nums.length === 0) return 0;
    //     const mean = nums.reduce((acc, num) => acc + num, 0) / nums.length;
    //     const squaredDiffs = nums.map(num => Math.pow(num - mean, 2));
    //     const variance = squaredDiffs.reduce((acc, diff) => acc + diff, 0) / nums.length;
    //     return Math.sqrt(variance);
    // }

    // function mapNbaGameStatsAvgsQuickStatsToQuickStatsTableRowCells(obj: NbaGameStatsAvgsHistorical) {
    //     const expandingAvgObj = getLatestGameStatsObj(Object.values(obj.expandingAvg));
    //     const avg5Obj = getLatestGameStatsObj(Object.values(obj.rollingAvg5));
    //     const avg10Obj = getLatestGameStatsObj(Object.values(obj.rollingAvg10));
    //     const numsForStdDeviation = Object.values(obj.gameStats).map(getGamesStatsPeriodValue);

    //     const expandingAvgLabel = expandingAvgObj ? getGamesStatsPeriodValue(expandingAvgObj) || '-' : '-';
    //     const expandingAvgCellParams = {
    //         label: expandingAvgLabel
    //     };

    //     const avg5Label = avg5Obj ? getGamesStatsPeriodValue(avg5Obj) || '-' : '-';
    //     const avg5CellParams = {
    //         label: avg5Label,
    //         positive: isNaN(avg5Label as any) || isNaN(expandingAvgLabel as any) ? false : avg5Label > expandingAvgLabel,
    //         negative: isNaN(avg5Label as any) || isNaN(expandingAvgLabel as any) ? false : avg5Label < expandingAvgLabel
    //     };

    //     const avg10Label = avg10Obj ? getGamesStatsPeriodValue(avg10Obj) || '-' : '-';
    //     const avg10CellParams = {
    //         label: expandingAvgLabel,
    //         positive: isNaN(avg10Label as any) || isNaN(expandingAvgLabel as any) ? false : avg10Label > expandingAvgLabel,
    //         negative: isNaN(avg10Label as any) || isNaN(expandingAvgLabel as any) ? false : avg10Label < expandingAvgLabel
    //     };

    //     return [
    //         { label: obj.teamNickname },
    //         expandingAvgCellParams,
    //         avg5CellParams,
    //         avg10CellParams,
    //         { label: getStdDeviation(numsForStdDeviation) || '-' }
    //     ];
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
                    {/* <QuickStatsTable params={
                        {
                            rows: quickStatsTableRows, 
                            headers: quickStatsTableHeaders, 
                        }
                    }
                    /> */}
                </div>
            </div>
        </div>
    )
}

export default MatchupQuickStats;