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

const MatchupQuickStats: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    const [betOption, setBetOption] = useState(BetOptions.Team); 
    const [quickStatsAgg, setQuickStatsAgg] = useState(QuickStatsAggregation.Averages);
    const [gamePeriod, setGamePeriod] = useState(GamePeriods.Total);
    const [quickStatsTableRows, setQuickStatsTableRows] = useState([] as any[]);
    const [quickStatsTableHeaders, setQuickStatsTableHeaders] = useState([] as any[]);
    
    /** init api calls */
    useEffect(() => {    
        setQuickStatsTable();
    }, []);


    function getTeamStatsAvgTableHeaders() {
        // This can be used for quarters or halves linescores 
        // return ['', 'Avg', '5 Avg', '10 Avg', 'σ'];
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

    // function getLatestGameStatsObj(stats: GameStats[]) {
    //     return stats.sort((a, b) => Date.parse(a.dateStart) - Date.parse(b.dateStart)).pop();
    // }

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
          //TODO do more logic to incorporate different sports and line types
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