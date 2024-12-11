import { useState } from "react";
import { BetOptions } from "../../../../../models/enums/bet-options";
import { TeamBetOptionFilter } from "../../../../../models/enums/team-bet-option-filter";
import { Matchup } from "../../../../../models/matchup";
import LineChartComponent from "../../../line-chart/line-chart.component";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { quickStatsLineChartStyle } from "../../../../../models/form-styles/styles";
import { SportsCategories } from "../../../../../models/enums/sports-categories";
import { QuickStatsAggregation } from "../../../../../models/enums/quick-stats-aggregation";

// TODO FINISH THIS COMPONENT ASAP
const ChartAnalyzer: React.FC<{matchup: Matchup, betOption: BetOptions}> = ({matchup, betOption}) => {
    enum MatchTeamOption {
        Away = 'Away',
        Home = 'Home'
    };

    enum GameStatsOption {
        q1 = 'q1',
        q2 = 'q2',
        h1 = 'h1',
        q3 = 'q3',
        q4 = 'q4',
        h2 = 'h4',
        total = 'total'
    };

    interface GameStatsLine {
        gameStatsOption: GameStatsOption,
        aggregation: QuickStatsAggregation,
        avgsScope?: number
    }

    const [nbaTeamFilters, setNbaTeamFilters] = useState({ 
        teamFilter: MatchTeamOption.Away,
        gameStatsLineComparator: {
            gameStatsOption: GameStatsOption.total,
            aggregation: QuickStatsAggregation.Actual,
        },
        additionalGameStatsLines: [],
    });
    
    // TODO replace mock data 
    const data = [
        { date: '2024-01-01', value: 400 },
        { date: '2024-01-02', value: 300 },
        { date: '2024-01-03', value: 500 },
        { date: '2024-01-04', value: 700 },
        { date: '2024-01-05', value: 200 },
        // Add more data points as needed
    ];

    function getInitChartData() {
        // switch (matchup.sportsCategory) {
        //     case SportsCategories.NBA:
        //         if (betOption === BetOptions.Team) {
        //             get
        //         }
        // }
    }
    
    const handleFilterChange = (value: any) => {
        // const filtersUpdate = {
        //     ...teamFilters, 
        //     ...value
        // };
        // setTeamFilters(filtersUpdate);
    };

    const lineChart = () => {
        return (
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={data}
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
                {lineChart()}
            </div>
        </div>
    );
}

export default ChartAnalyzer;