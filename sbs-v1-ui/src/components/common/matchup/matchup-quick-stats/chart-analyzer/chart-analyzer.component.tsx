import { useEffect, useState } from "react";
import { BetOptions } from "../../../../../models/enums/bet-options";
import { GameLocationsFilter } from "../../../../../models/enums/game-locations-filter";
import { Matchup } from "../../../../../models/matchup";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { quickStatsLineChartStyle } from "../../../../../models/form-styles/styles";
import { SportsCategories } from "../../../../../models/enums/sports-categories";
import { QuickStatsAggregation } from "../../../../../models/enums/quick-stats-aggregation";
import { GameStatsOption } from "../../../../../models/enums/game-stats-option";
import { TeamOptionsFilter } from "../../../../../models/enums/team-options-filter";
import { calculateRollingAverages, sortGameStatsObjs } from "../../../../../utils/utils";
import { GameStats } from "../../../../../models/nba-team-agg-game-stats-historical";
import { GameStatsFilters, NbaTeamFilters } from "../../../../../models/component/nba-team-filters";

// TODO APPLY FILTERS
const ChartAnalyzer: React.FC<{matchup: Matchup, betOption: BetOptions}> = ({matchup, betOption}) => {
    /* consts ***********************************************************************/
    const [nbaTeamFilters, setNbaTeamFilters] = useState({ 
        teamFilter: TeamOptionsFilter.Away,
        gameLocationFilter: GameLocationsFilter.All,
        gameStatsLineComparator: {
            gameStatsOption: GameStatsOption.total,
            aggregation: QuickStatsAggregation.Actual,
            lineOfBestFit: true
        } as GameStatsFilters,
        additionalGameStatsLines: [],
    } as NbaTeamFilters);

    const [chartData, setChartData] = useState([]);
    /********************************************************************************/
    
    useEffect(() => {
        getInitChartData();
    }, []);

    /* chart data getters ***********************************************************/
    const getNbaChartDataForTeamBetOptionHelper = (
        gameStats: GameStats[], 
        gameStatsFilter: GameStatsFilters
    ) => {
        const teamPointsChartData = sortGameStatsObjs(Object.values(gameStats))
            .filter((gs: GameStats) => {
                if (nbaTeamFilters.gameLocationFilter === GameLocationsFilter.Away) {
                    return !gs.isHome;
                } else if (nbaTeamFilters.gameLocationFilter === GameLocationsFilter.Home) {
                    return gs.isHome;
                }
                return true;
            })
            .map((gs: GameStats) => {
                const gameStatsOption: GameStatsOption = nbaTeamFilters.gameStatsLineComparator.gameStatsOption;
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

        if (gameStatsFilter.aggregation === QuickStatsAggregation.Actual) {
            return teamPointsChartData;
        } else if (gameStatsFilter.aggregation === QuickStatsAggregation.RollingAverage) {
            const teamPoints = teamPointsChartData.map(_ => _.points);
            return calculateRollingAverages(teamPoints, gameStatsFilter.aggregationSlice!);
        }
        return [];
    };

    const getNbaChartDataForTeamBetOption = () => {
        // TODO implement for different season ehhh
        let gameStats = nbaTeamFilters.teamFilter === TeamOptionsFilter.Home ? 
            matchup.home.teamAggGameStats.gameStats : 
            matchup.away.teamAggGameStats.gameStats;

        return getNbaChartDataForTeamBetOptionHelper(
            Object.values(gameStats), 
            nbaTeamFilters.gameStatsLineComparator
        );
    };

    const getInitChartData = () => {
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA:
                if (betOption === BetOptions.Team) {
                    setChartData(getNbaChartDataForTeamBetOption() as any); 
                }
        }
    };
    /********************************************************************************/
    
    const handleFilterChange = (value: any) => {
        // implement this after filters are implemented
        // const filtersUpdate = {
        //     ...teamFilters, 
        //     ...value
        // };
        // setTeamFilters(filtersUpdate);
    };

    const getLineChart = () => {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={chartData}
                    margin={{
                        top: 0, right: 0, left: -30, bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
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
            <div className="chart-wrapper">
                {getLineChart()}
            </div>
        </div>
    );
}

export default ChartAnalyzer;