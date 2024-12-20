import { useEffect, useState } from "react";
import { BetOptions } from "../../../../../models/enums/bet-options";
import { GameLocationsFilter } from "../../../../../models/enums/game-locations-filter";
import { Matchup } from "../../../../../models/matchup";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { quickStatsLineChartStyle } from "../../../../../models/form-styles/styles";
import { SportsCategories } from "../../../../../models/enums/sports-categories";
import ChartAnalyzerFilters from "./chart-analyzer-filters/chart-analyzer-filters.component";
import './chart-analyzer.component.scss';
import { NbaTeamGameStatsFilters } from "../../../../../models/component/nba-team-game-stats-filters";
import { GameStatsOption } from "../../../../../models/enums/game-stats-option";
import { calculateRollingAverages, calculatgedExpandingAverages, sortGameStatsObjs } from "../../../../../utils/utils";
import { TeamOptionsFilter } from "../../../../../models/enums/team-options-filter";
import { GameStats } from "../../../../../models/nba-team-agg-game-stats-historical";
import { QuickStatsAggregation } from "../../../../../models/enums/quick-stats-aggregation";
import { groupBy } from "lodash";

const ChartAnalyzer: React.FC<{matchup: Matchup, betOption: BetOptions}> = ({matchup, betOption}) => {
    /* consts ***********************************************************************/
    const [chartData, setChartData] = useState([] as any[]);
    const [filters, setFilters] = useState([] as any[]);
    /********************************************************************************/

    useEffect(() => {
        setChartData(getNbaTeamGameStatsFiltersChartData(filters));
    }, [filters]);

    const handleFilterChange = (newFilters: NbaTeamGameStatsFilters[]) => {
        if (betOption === BetOptions.Team) {
            switch (matchup.sportsCategory) {
                case SportsCategories.NBA: {
                    setFilters(newFilters);
                }
            }
        }
    };

    /* chart data getters ***********************************************************/
    const getMaxNumOfGamesWithFilters = (
        filters: NbaTeamGameStatsFilters[], 
        awayGs: GameStats[], 
        homeGs: GameStats[]
    ) => {
        return Math.max(
            ...filters.map((filter: NbaTeamGameStatsFilters) => (
                applyGameLocationAndTeamFilter(filter, awayGs, homeGs).length
            ))
        );
    };

    const applyGameLocationAndTeamFilter = (
        filter: NbaTeamGameStatsFilters, 
        awayGs: GameStats[], 
        homeGs: GameStats[]
    ) => {
        const gameStats = filter.teamFilter === TeamOptionsFilter.Away ? awayGs : homeGs;
        return  gameStats.filter((gs: GameStats) => {
            if (filter.gameLocationFilter === GameLocationsFilter.Away) {
                return !gs.isHome;
            } else if (filter.gameLocationFilter === GameLocationsFilter.Home) {
                return gs.isHome;
            }
            return true;
        });
    };

    const getNbaTeamGameStatsFiltersChartData = (filters: NbaTeamGameStatsFilters[]) => {
        const sortedAwayAggStats = sortGameStatsObjs(Object.values(matchup.away.teamAggGameStats.gameStats));
        const sortedHomeAggStats = sortGameStatsObjs(Object.values(matchup.home.teamAggGameStats.gameStats));

        const maxNumOfGames = getMaxNumOfGamesWithFilters(filters, sortedAwayAggStats, sortedHomeAggStats);
        const rawChartData = filters.flatMap((filter: NbaTeamGameStatsFilters) => {    
            let applicableGames: any = applyGameLocationAndTeamFilter(
                filter, 
                sortedAwayAggStats, 
                sortedHomeAggStats
            );
            
            const offset = maxNumOfGames - applicableGames.length;
            
            applicableGames = applicableGames.map((gs: GameStats, idx: any) => {
                const gameStatsOption: GameStatsOption = filter.gameStatsOption;
                const x = offset + idx;
                let y;
                if (gameStatsOption === GameStatsOption.q1) {
                    // TODO make y axis key to be attached to id
                    y =  gs.linescore[0];
                } else if (gameStatsOption === GameStatsOption.q2) {
                    y = gs.linescore[1];
                } else if (gameStatsOption === GameStatsOption.h1) {
                    y = gs.linescore[0] + gs.linescore[1];
                } else if (gameStatsOption === GameStatsOption.q3) {
                   y = gs.linescore[2];
                } else if (gameStatsOption === GameStatsOption.q4) {
                    y = gs.linescore[3];
                } else if (gameStatsOption === GameStatsOption.h2) {
                    y = gs.linescore[2] + gs.linescore[3];
                } else {
                    y = gs.points;
                }
                return  { x: x, y: y };
            });

            if (filter.numberOfGames !== undefined) {
                applicableGames = applicableGames.slice(
                    applicableGames.length - filter.numberOfGames, 
                    applicableGames.length
                );
            }

            const points = applicableGames.map((_: any) => _.y);
            let aggregatedPoints: any[] = []; 
            if (filter.aggregation === QuickStatsAggregation.Actual) {
                aggregatedPoints = points;
            } else if (filter.aggregation === QuickStatsAggregation.RollingAverage) {
                aggregatedPoints =  calculateRollingAverages(points, filter.aggregationSlice);
            } else if (filter.aggregation === QuickStatsAggregation.ExpandingAverage) {
                aggregatedPoints = calculatgedExpandingAverages(points);
            }

            applicableGames = applicableGames.map((chartDataObj: any, idx: any) => {
                const chartDataObjWithAggStats: any = {
                    x: chartDataObj.x
                };
                chartDataObjWithAggStats[`${filter.id}`] = aggregatedPoints[idx];
                return chartDataObjWithAggStats;
            });

            return applicableGames;
        });

        const flattenedChartData = Object.values(groupBy(rawChartData, (x) => x.x))
            .map((arr: any[]) => {
                return arr.reduce((prev: any, curr: any) => (
                    { ...prev, ...curr }
                ), {});
            });

        return flattenedChartData;
    };
    /********************************************************************************/

    const getLineChart = (chartData: any[]) => {
        const chartLineColors = [
            // TODO: think about these colors
            '#6a5acd',
            '#cd5a84',
            '#bdcd5a',
            '#5acda3'
        ];

        return (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={chartData}
                    margin={{
                        top: 0, right: 0, left: -30, bottom: 0,
                    }}
                >
                    <CartesianGrid stroke="#ddd" vertical={false}/>
                    <XAxis dataKey="date" style={quickStatsLineChartStyle} hide={true}/>
                    <YAxis style={quickStatsLineChartStyle}/>
                    <Tooltip />
                    <Legend />
                    {
                        filters.map((filter: any, idx: any) => (
                            <Line 
                                type="monotone" 
                                dataKey={`${filter.id}`}
                                stroke={chartLineColors[idx]} 
                                dot={false} 
                                activeDot={{ r: 1 }} 
                            />
                        ))
                    }
                </LineChart>
          </ResponsiveContainer>
        )
    }
    
    return (
        <div className="chart-analyzer-container">
            <ChartAnalyzerFilters betOption={betOption} matchup={matchup} handleFilterChange={handleFilterChange}/>
            <div className="chart-wrapper">
                {getLineChart(chartData)}
            </div>
        </div>
    );
}

export default ChartAnalyzer;