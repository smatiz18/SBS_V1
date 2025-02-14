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
import { calculateRollingAverages, calculatedExpandingAverages, mean, sortGameStatsObjs, stdDeviation } from "../../../../../utils/utils";
import { TeamOptionsFilter } from "../../../../../models/enums/team-options-filter";
import { GameStats } from "../../../../../models/nba-team-agg-game-stats-historical";
import { QuickStatsAggregation } from "../../../../../models/enums/quick-stats-aggregation";
import { get, groupBy, max, min, set } from "lodash";

const ChartAnalyzer: React.FC<{matchup: Matchup, betOption: BetOptions}> = ({matchup, betOption}) => {
    /* consts ***********************************************************************/
    const [chartData, setChartData] = useState([] as any[]);
    const [filters, setFilters] = useState([] as any[]);
    /********************************************************************************/

    useEffect(() => {
        const chartDataWithNoRefLines = getNbaTeamGameStatsFiltersChartData(filters);
        const enrichedChartDataWithRefLines = enrichChartDataWithRefLines(chartDataWithNoRefLines, filters);
        setChartData(enrichedChartDataWithRefLines);
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
                return  { x: x, y: parseFloat(y.toFixed(2)) };
            });

            if (filter.numberOfGames !== undefined) {
                applicableGames = applicableGames.slice(
                    applicableGames.length - filter.numberOfGames < 0 ? 0 : applicableGames.length - filter.numberOfGames, 
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
                aggregatedPoints = calculatedExpandingAverages(points);
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

    const enrichChartDataWithRefLines = (chartData: any[], filters: NbaTeamGameStatsFilters[]) => {
        filters.forEach((filter: NbaTeamGameStatsFilters) => {
            const data = chartData.filter((dataPoint: any) => get(dataPoint, `${filter.id}`) !== undefined)
                .map((dataPoint: any) => get(dataPoint, `${filter.id}`));
            
            if (filter.showStdDeviationLines) {
                const stdDev = stdDeviation(data);
                const m = mean(data);

                chartData.forEach((dp: any) => {
                    set(dp, `${filter.id}_+_1_σ`, parseFloat((m + stdDev).toFixed(2)));
                    set(dp, `${filter.id}_-_1_σ`, parseFloat((m - stdDev).toFixed(2)));
                });
            }

            if (filter.showMinMaxLines) {
                const maxPoint = max(data);
                const minPoint = min(data);
                chartData.forEach((dp: any) => {
                    set(dp, `${filter.id}_max`, parseFloat(maxPoint.toFixed(2)));
                    set(dp, `${filter.id}_min`, parseFloat(minPoint.toFixed(2)));
                });
            }

            // TODO to be implemented
            if (filter.showLineOfBestFit) {

            }
        });
        return chartData;
    };

    const getLineChart = (chartData: any[]) => {
        const COLOR_1 = '#6a5acd';
        const COLOR_2 = '#cd5a84';
        const COLOR_3 = '#bdcd5a';
        const COLOR_4 = '#5acda3';
        const chartLineColors = [
            COLOR_1,
            COLOR_2,
            COLOR_3,
            COLOR_4
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
                        filters.flatMap((filter: NbaTeamGameStatsFilters, idx: any) => {
                            const lines = [
                                (
                                    <Line 
                                        type="monotone" 
                                        dataKey={`${filter.id}`}
                                        stroke={chartLineColors[idx]} 
                                        dot={false} 
                                        activeDot={{ r: 1 }} 
                                    />
                                )
                            ];

                            if (filter.showStdDeviationLines) {
                                lines.push(
                                    <Line 
                                        type="monotone" 
                                        dataKey={`${filter.id}_+_1_σ`}
                                        stroke={chartLineColors[idx]} 
                                        strokeDasharray="5 5"
                                        dot={false} 
                                    />
                                );
                                lines.push(
                                    <Line 
                                        type="monotone" 
                                        dataKey={`${filter.id}_-_1_σ`}
                                        stroke={chartLineColors[idx]} 
                                        strokeDasharray="5 5"
                                        dot={false} 
                                    />
                                );
                            }

                            if (filter.showMinMaxLines) {
                                lines.push(
                                    <Line 
                                        type="monotone" 
                                        dataKey={`${filter.id}_max`}
                                        stroke={chartLineColors[idx]} 
                                        strokeDasharray="5 5"
                                        dot={false} 
                                    />
                                );
                                lines.push(
                                    <Line 
                                        type="monotone" 
                                        dataKey={`${filter.id}_min`}
                                        stroke={chartLineColors[idx]} 
                                        strokeDasharray="5 5"
                                        dot={false} 
                                    />
                                );
                            }
                            return lines;
                        })
                    }
                </LineChart>
          </ResponsiveContainer>
        )
    }
    /********************************************************************************/
    
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