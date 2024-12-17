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

const ChartAnalyzer: React.FC<{matchup: Matchup, betOption: BetOptions}> = ({matchup, betOption}) => {
    /* consts ***********************************************************************/
    const [chartData, setChartData] = useState([] as any[]);
    /********************************************************************************/

    const handleFilterChange = (newFilters: NbaTeamGameStatsFilters[]) => {
        if (betOption === BetOptions.Team) {
            switch (matchup.sportsCategory) {
                case SportsCategories.NBA: {
                    setChartData(getNbaTeamGameStatsFiltersChartData(newFilters));
                }
            }
        }
    };

    /* chart data getters ***********************************************************/
    const getNbaTeamGameStatsFiltersChartData = (filters: NbaTeamGameStatsFilters[]) => {
        const sortedAwayAggStats = sortGameStatsObjs(Object.values(matchup.away.teamAggGameStats.gameStats));
        const sortedHomeAggStats = sortGameStatsObjs(Object.values(matchup.home.teamAggGameStats.gameStats));

        const filteredStats = filters.map((filter: NbaTeamGameStatsFilters) => {
            const gameStats = filter.teamFilter === TeamOptionsFilter.Away ? sortedAwayAggStats : sortedHomeAggStats;
            const filteredStats = gameStats.filter((gs: GameStats) => {
                if (filter.gameLocationFilter === GameLocationsFilter.Away) {
                    return !gs.isHome;
                } else if (filter.gameLocationFilter === GameLocationsFilter.Home) {
                    return gs.isHome;
                }
                return true;
            }).map((gs: GameStats) => {
                const gameStatsOption: GameStatsOption = filter.gameStatsOption;
                if (gameStatsOption === GameStatsOption.q1) {
                    return { date: gs.dateStart, points: gs.linescore[0] };
                } else if (gameStatsOption === GameStatsOption.q2) {
                    return { date: gs.dateStart, points: gs.linescore[1] };
                } else if (gameStatsOption === GameStatsOption.h1) {
                    return { date: gs.dateStart, points: gs.linescore[0] + gs.linescore[1] };
                } else if (gameStatsOption === GameStatsOption.q3) {
                    return { date: gs.dateStart, points: gs.linescore[2] };
                } else if (gameStatsOption === GameStatsOption.q4) {
                    return { date: gs.dateStart, points: gs.linescore[3] };
                } else if (gameStatsOption === GameStatsOption.h2) {
                    return { date: gs.dateStart, points: gs.linescore[2] + gs.linescore[3] };
                } else {
                    return { date: gs.dateStart, points: gs.points };
                }
            });

            const points = filteredStats.map(_ => _.points);

            let aggregatedPoints: any[] = [];
            if (filter.aggregation === QuickStatsAggregation.Actual) {
                return filteredStats;
            } else if (filter.aggregation === QuickStatsAggregation.RollingAverage) {
                aggregatedPoints =  calculateRollingAverages(points, 5);
                console.log('points: ', points);
                console.log('aggregatedPoints: ', aggregatedPoints);
                
            } else if (filter.aggregation === QuickStatsAggregation.ExpandingAverage) {
                aggregatedPoints = calculatgedExpandingAverages(points);
            }
            return filteredStats.map((x, idx) => {
                x.points = aggregatedPoints[idx] as number;
                return x;
            });
        });

        return filteredStats;
    };
    /********************************************************************************/

    const getLineChart = (chartData: any[]) => {
        console.log('chart data: ', chartData);
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
                    <Line type="monotone" dataKey="points" stroke="#4661b7" activeDot={{ r: 8 }} />
                </LineChart>
          </ResponsiveContainer>
        )
    }
    
    return (
        <div className="chart-analyzer-container">
            <ChartAnalyzerFilters betOption={betOption} matchup={matchup} handleFilterChange={handleFilterChange}/>
            <div className="chart-wrapper">
                {getLineChart(chartData[0])}
            </div>
        </div>
    );
}

export default ChartAnalyzer;