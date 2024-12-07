import { useState } from "react";
import { BetOptions } from "../../../../models/enums/bet-options";
import { MatchupLinesAndStats } from "../../../../models/matchup-lines-and-stats";
import { QuickStatsAggregation } from "../../../../models/enums/quick-stats-aggregation";
import AvgsTable from "./avgs/avgs-table.component";
import _ from "lodash";
import './matchup-quick-stats.component.scss';

const MatchupQuickStats: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    const [betOption, setBetOption] = useState(BetOptions.Team); 
    const [quickStatsAgg, setQuickStatsAgg] = useState(QuickStatsAggregation.Averages);

    return (
        <div className="matchup-quick-stats-component-container">
            <div className="quick-stats-container">
                <div className="header-container">
                    <h3>Quick Stats</h3>                    
                    <div className="line"></div>
                </div>
                <div className="avgs-table-wrapper">
                    <AvgsTable matchup={matchup} betOption={betOption}/>
                </div>
            </div>
        </div>
    )
}

export default MatchupQuickStats;