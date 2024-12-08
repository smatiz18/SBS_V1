import { useState } from "react";
import { BetOptions } from "../../../../models/enums/bet-options";
import { MatchupLinesAndStats } from "../../../../models/matchup-lines-and-stats";
import { QuickStatsAggregation } from "../../../../models/enums/quick-stats-aggregation";
import AvgsTable from "./avgs/avgs-table.component";
import _ from "lodash";
import './matchup-quick-stats.component.scss';
import Pagination from "@mui/material/Pagination";
import './matchup-quick-stats.component.scss';
import { paginationSx } from "../../../../models/form-styles/styles";
import PaginationItem from "@mui/material/PaginationItem";

const MatchupQuickStats: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    const [betOption, setBetOption] = useState(BetOptions.Team); 
    const [quickStatsAgg, setQuickStatsAgg] = useState(QuickStatsAggregation.Averages);
    const pageLabels = ['Game Averages', 'Chart Analyzer', 'Past Occurences']; 

    return (
        <div className="quick-stats-container">
            <div className="header-container">
                <h3>Quick Stats</h3>                    
                <div className="line"></div>
            </div>
            <div className="avgs-table-wrapper">
                <AvgsTable matchup={matchup} betOption={betOption}/>
            </div>
            <div className="pagination-wrapper">
                <Pagination count={3} shape="rounded" sx={paginationSx}
                    renderItem={(item) => (
                        <PaginationItem
                          {...item}
                          page={pageLabels[item.page! - 1] || item.page}
                        />
                    )}
                />
            </div>
        </div>
    );
}

export default MatchupQuickStats;