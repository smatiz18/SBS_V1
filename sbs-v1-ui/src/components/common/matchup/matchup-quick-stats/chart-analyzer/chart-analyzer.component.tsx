import { useEffect, useState } from "react";
import { BetOptions } from "../../../../../models/enums/bet-options";
import { GameLocationsFilter } from "../../../../../models/enums/game-locations-filter";
import { Matchup } from "../../../../../models/matchup";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { quickStatsLineChartStyle } from "../../../../../models/form-styles/styles";
import { SportsCategories } from "../../../../../models/enums/sports-categories";
import ChartAnalyzerFilters from "./chart-analyzer-filters/chart-analyzer-filters.component";
import { NbaTeamGameStatsFilters } from "../../../../../models/component/nba-team-game-stats-filters";
import { GameStatsOption } from "../../../../../models/enums/game-stats-option";
import { calculateRollingAverages, calculatedExpandingAverages, mean, sortGameStatsObjs, sortNbaPlayerStatsObjs, stdDeviation } from "../../../../../utils/utils";
import { TeamOptionsFilter } from "../../../../../models/enums/team-options-filter";
import { GameStats } from "../../../../../models/nba-team-agg-game-stats-historical";
import { QuickStatsAggregation } from "../../../../../models/enums/quick-stats-aggregation";
import { get, groupBy, max, min, set } from "lodash";
import { NbaPlayerGameStatsFilters } from "../../../../../models/component/nba-player-game-stats-filters";
import { PlayerStatsObj } from "../../../../../models/nba-player-game-stats-historical";
import { NbaPlayerStatsOption } from "../../../../../models/enums/nba-player-stats-option";
import { getAllNbaPlayerStatsObjsFromAllTeams } from "../../../../../models/nba-player-agg-game-stats-historical";
import './chart-analyzer.component.scss';

const ChartAnalyzer: React.FC<{
    matchup: Matchup, 
    betOption: BetOptions,
    selectedPlayerName?: string
}> = ({matchup, betOption, selectedPlayerName}) => {
    /* consts ***********************************************************************/
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
    const [chartData, setChartData] = useState([] as any[]);
    const [teamFilters, setTeamFilters] = useState([] as any[]);
    const [playerFilters, setPlayerFilters] = useState([] as any[]);
    /********************************************************************************/

   /* consts ***********************************************************************/
    useEffect(() => {
        let enrichedChartDataWithRefLines = [];
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA: {
                if (betOption === BetOptions.Team) {
                    const chartDataWithNoRefLines = getNbaTeamGameStatsFiltersChartData(teamFilters);
                    enrichedChartDataWithRefLines = enrichChartDataWithRefLines(chartDataWithNoRefLines, teamFilters);
                } else {
                    const chartDataWithNoRefLines = getNbaPlayerGameStatsFilterChartData(playerFilters);
                    enrichedChartDataWithRefLines = enrichChartDataWithRefLines(chartDataWithNoRefLines, playerFilters);
                }
                break;
            }
        }
        setChartData(enrichedChartDataWithRefLines);
    }, [teamFilters, playerFilters, betOption, selectedPlayerName]);
    /*******************************************************************************/

    /* event handlers **************************************************************/
    const handleFilterChange = (newFilters: (NbaTeamGameStatsFilters | NbaPlayerGameStatsFilters)[]) => {
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA: {
                if (betOption === BetOptions.Team) {
                    setTeamFilters(newFilters as NbaTeamGameStatsFilters[]);
                } else {
                    setPlayerFilters(newFilters as NbaPlayerGameStatsFilters[]);
                }
            }

        }
    };
    /*******************************************************************************/

    /* team view ********************************************************************/
    const getNbaMaxNumOfTeamGamesWithFilters = (
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

        const maxNumOfGames = getNbaMaxNumOfTeamGamesWithFilters(filters, sortedAwayAggStats, sortedHomeAggStats);
        const rawChartData = filters.flatMap((filter: NbaTeamGameStatsFilters) => {    
            let applicableGames: any = applyGameLocationAndTeamFilter(
                filter, 
                sortedAwayAggStats, 
                sortedHomeAggStats
            );
            
            const offset = maxNumOfGames - applicableGames.length;
            
            applicableGames = applicableGames.map((gs: GameStats, idx: number) => {
                const gameStatsOption: GameStatsOption = filter.gameStatsOption;
                const x = offset + idx;
                let y = 0;
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

            applicableGames = applyNumberOfGamesFilter(applicableGames, filter.numberOfGames);

            const points = applicableGames.map((_: any) => _.y);
            let aggregatedPoints: any[] = applyAggregationToChartDataPoints(
                points, 
                filter.aggregation, 
                filter.aggregationSlice
            );

            return formatToChartDataObjWithAggStats(applicableGames, aggregatedPoints, filter.id);

        });

        return flattenChartData(rawChartData);
    };
    /********************************************************************************/
    
    /* player view ******************************************************************/
    const getNbaMaxNumOfPlayerGamesWithFilters = (
        filters: NbaPlayerGameStatsFilters[],
        games: PlayerStatsObj[]
    ) => {
        return Math.max(
            ...filters.map((filter: NbaPlayerGameStatsFilters) => (
                applyPlayerGameLocationAndTeamFilter(filter, games).length
            ))
        );
    };

    const applyPlayerGameLocationAndTeamFilter = (
        filter: NbaPlayerGameStatsFilters,
        playerGameStats: PlayerStatsObj[]
    ) => {
        return playerGameStats.filter((pgs: PlayerStatsObj) => { 
            let gameLocationFilter = true;
            if (filter.gameLocationFilter === GameLocationsFilter.Away) {
                gameLocationFilter = !pgs.isHome;
            } else if (filter.gameLocationFilter === GameLocationsFilter.Home) {
                gameLocationFilter = pgs.isHome;
            }
            let teamIdFilter = true;
            if (filter.teamIdFilter !== undefined) {
                teamIdFilter = pgs.teamId === filter.teamIdFilter;
            }
            return teamIdFilter && gameLocationFilter; 
        });
    }
    
    const getNbaPlayerGameStatsFilterChartData = (filters: NbaPlayerGameStatsFilters[]) => {
        const enrichedStats = getAllNbaPlayerStatsObjsFromAllTeams(matchup.playerAggGameStats, selectedPlayerName!);

        const maxNumOfGames = getNbaMaxNumOfPlayerGamesWithFilters(filters, enrichedStats);
        const rawChartData = filters.flatMap((filter: NbaPlayerGameStatsFilters) => {
            let applicableGames: any = applyPlayerGameLocationAndTeamFilter(
                filter,
                enrichedStats
            );

            const offset = maxNumOfGames - applicableGames.length;

            applicableGames = applicableGames.map((pso: PlayerStatsObj, idx: number) => {
                const x = offset + idx;
                let y = 0; 
                switch (filter.playerStatsOption) {
                    case NbaPlayerStatsOption.Points:
                        y = pso.points || 0;
                        break;
                    case NbaPlayerStatsOption.Min:
                        y = pso.min || 0;
                        break;
                    case NbaPlayerStatsOption.Fgm:
                        y = pso.fgm || 0;
                        break;
                    case NbaPlayerStatsOption.Fga:
                        y = pso.fga || 0;
                        break;
                    case NbaPlayerStatsOption.Fgp:
                        y = pso.fgp || 0;
                        break;
                    case NbaPlayerStatsOption.Ftm:
                        y = pso.ftm || 0;
                        break;
                    case NbaPlayerStatsOption.Fta:
                        y = pso.fta || 0;
                        break;
                    case NbaPlayerStatsOption.Ftp:
                        y = pso.ftp || 0;
                        break;
                    case NbaPlayerStatsOption.Tpm:
                        y = pso.tpm || 0;
                        break;
                    case NbaPlayerStatsOption.Tpa:
                        y = pso.tpa || 0;
                        break;
                    case NbaPlayerStatsOption.Tpp:
                        y = pso.tpp || 0;
                        break;
                    case NbaPlayerStatsOption.OffReb:
                        y = pso.offReb || 0;
                        break;
                    case NbaPlayerStatsOption.DefReb:
                        y = pso.defReb || 0;
                        break;
                    case NbaPlayerStatsOption.TotReb:
                        y = pso.totReb || 0;
                        break;
                    case NbaPlayerStatsOption.Assists:
                        y = pso.assists || 0;
                        break;
                    case NbaPlayerStatsOption.PFouls:
                        y = pso.pFouls || 0;
                        break;
                    case NbaPlayerStatsOption.Steals:
                        y = pso.steals || 0;
                        break;
                    case NbaPlayerStatsOption.Turnovers:
                        y = pso.turnovers || 0;
                        break;
                    case NbaPlayerStatsOption.Blocks:
                        y = pso.blocks || 0;
                        break;
                    case NbaPlayerStatsOption.PlusMinu:
                        y = pso.plusMinus || 0;
                        break;
                    default:
                        y = pso.points || 0;
                        break;
                }
                return  { x: x, y: parseFloat(y.toFixed(2)) };
            });

            applicableGames = applyNumberOfGamesFilter(applicableGames, filter.numberOfGames);

            const points = applicableGames.map((_: any) => _.y);
            let aggregatedPoints: any[] = applyAggregationToChartDataPoints(
                points, 
                filter.aggregation, 
                filter.aggregationSlice
            );

            return formatToChartDataObjWithAggStats(applicableGames, aggregatedPoints, filter.id);
        });

        return flattenChartData(rawChartData);
    };
    /********************************************************************************/

    /* generic chart data filter helper funcs ***************************************/
    const flattenChartData = (rawChartData: any[]) => {
        return Object.values(groupBy(rawChartData, (x) => x.x))
            .map((arr: any[]) => {
                return arr.reduce((prev: any, curr: any) => (
                    { ...prev, ...curr }
                ), {});
            });
    }
    
    const formatToChartDataObjWithAggStats = (applicableGames: any[], aggregatedPoints: any[], filterId: any) => {
        return applicableGames.map((chartDataObj: any, idx: any) => {
            const chartDataObjWithAggStats: any = {
                x: chartDataObj.x
            };
            chartDataObjWithAggStats[`${filterId}`] = aggregatedPoints[idx];
            return chartDataObjWithAggStats;
        });
    }

    const applyNumberOfGamesFilter = (applicableGames: any[], numGameFilter?: number) => {
        if (numGameFilter !== undefined) {
            applicableGames = applicableGames.slice(
                applicableGames.length - numGameFilter < 0 ? 0 : applicableGames.length - numGameFilter, 
                applicableGames.length
            );
        }
        return applicableGames;
    }

    const applyAggregationToChartDataPoints = (points: number[], agg: QuickStatsAggregation, aggSlice: number) => {
        let aggregatedPoints: any[] = []; 
        if (agg === QuickStatsAggregation.Actual) {
            aggregatedPoints = points;
        } else if (agg === QuickStatsAggregation.RollingAverage) {
            aggregatedPoints =  calculateRollingAverages(points, aggSlice);
        } else if (agg === QuickStatsAggregation.ExpandingAverage) {
            aggregatedPoints = calculatedExpandingAverages(points);
        }
        return aggregatedPoints;
    };

    const enrichChartDataWithRefLines = (chartData: any[], filters: (NbaTeamGameStatsFilters | NbaPlayerGameStatsFilters)[]) => {
        filters.forEach((filter: NbaTeamGameStatsFilters | NbaPlayerGameStatsFilters) => {
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
    /********************************************************************************/

    /* chart getters ****************************************************************/
    const getTeamChartLines = () => {
        let chartLines = [];
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA:
                chartLines = teamFilters.flatMap((filter: NbaTeamGameStatsFilters, idx: any) => {
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
                });
                break;
        }
        return chartLines;
    }

    const getPlayerChartLines = () => {
        let chartLines = [];
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA:
                chartLines = playerFilters.flatMap((filter: NbaPlayerGameStatsFilters, idx: any) => {
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
                });
                break;
        }
        return chartLines;
    }
    /********************************************************************************/
    
    return (
        <div className="chart-analyzer-container">
            <ChartAnalyzerFilters betOption={betOption} matchup={matchup} handleFilterChange={handleFilterChange} selectedPlayerName={selectedPlayerName}/>
            <div className="chart-wrapper">
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
                        <Tooltip/>
                        <Legend />
                        {
                            betOption === BetOptions.Team ? getTeamChartLines() : getPlayerChartLines()
                        }
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ChartAnalyzer;