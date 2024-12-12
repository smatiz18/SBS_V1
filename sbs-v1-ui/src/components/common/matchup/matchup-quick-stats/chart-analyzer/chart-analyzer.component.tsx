import { useState } from "react";
import { BetOptions } from "../../../../../models/enums/bet-options";
import { GameLocationsFilter } from "../../../../../models/enums/game-locations-filter";
import { Matchup } from "../../../../../models/matchup";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { quickStatsLineChartStyle } from "../../../../../models/form-styles/styles";
import { SportsCategories } from "../../../../../models/enums/sports-categories";
import { QuickStatsAggregation } from "../../../../../models/enums/quick-stats-aggregation";
import { GameStatsOption } from "../../../../../models/enums/game-stats-option";
import { TeamOptionsFilter } from "../../../../../models/enums/team-options-filter";
import { sortGameStatsObjs } from "../../../../../utils/utils";

// TODO FINISH THIS COMPONENT ASAP
const ChartAnalyzer: React.FC<{matchup: Matchup, betOption: BetOptions}> = ({matchup, betOption}) => {
    /* consts ***********************************************************************/
    const [nbaTeamFilters, setNbaTeamFilters] = useState({ 
        teamFilter: TeamOptionsFilter.Away,
        gameLocationFilter: GameLocationsFilter.All,
        gameStatsLineComparator: {
            gameStatsOption: GameStatsOption.total,
            aggregation: QuickStatsAggregation.Actual,
            lineOfBestFit: true
        },
        additionalGameStatsLines: [],
    });

    const [chartData, setChartData] = useState([]);
    /********************************************************************************/

    // TODO replace mock data 
    const data = [
        { date: '2024-01-01', value: 400 },
        { date: '2024-01-02', value: 300 },
        { date: '2024-01-03', value: 500 },
        { date: '2024-01-04', value: 700 },
        { date: '2024-01-05', value: 200 },
        // Add more data points as needed
    ];

    /* chart data getters ***********************************************************/
    const getNbaChartDataForTeamBetOption = () => {
        // TODO implement for different season ehhh
        let gameStats = nbaTeamFilters.teamFilter === TeamOptionsFilter.Home ? 
            matchup.home.teamAggGameStats.gameStats : 
            matchup.away.teamAggGameStats.gameStats;

        const comparatorLineChartData = sortGameStatsObjs(Object.values(gameStats));

        return [];
    };

    const getInitChartData = () => {
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA:
                if (betOption === BetOptions.Team) {
                    setChartData(getNbaChartDataForTeamBetOption()); 
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
            <ResponsiveContainer width="100%" height={350}>
                <LineChart
                    data={chartData}
                    margin={{
                        top: 10, right: 30, left: 0, bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" style={quickStatsLineChartStyle}/>
                    <YAxis style={quickStatsLineChartStyle}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
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