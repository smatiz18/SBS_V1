import { ChangeEvent, ReactElement, useState } from "react";
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
import ChartAnalyzer from "./chart-analyzer/chart-analyzer.component";

const MatchupQuickStats: React.FC<{matchup: MatchupLinesAndStats, betOption: BetOptions}> = ({matchup, betOption}) => {
    const avgsTable = <AvgsTable matchup={matchup} betOption={betOption}/>;
    const chartAnalyzer = <ChartAnalyzer matchup={matchup} betOption={betOption}/>
    const pastOccurences = <div className="past-occurences"></div>;
    const pageToCompMap: Record<string, ReactElement> = {
        '1': avgsTable,
        '2': chartAnalyzer,
        '3': pastOccurences
    };

    const pageLabels = ['Game Averages', 'Chart Analyzer', 'Past Occurences']; 

    const [quickStatsAgg, setQuickStatsAgg] = useState(QuickStatsAggregation.Averages);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePaginationChange = (_: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    }

    return (
        <div className="quick-stats-container">
            <div className="header-container">
                <h3>Quick Stats</h3>                    
                <div className="line"></div>
            </div>
            {pageToCompMap[currentPage.toString()] || <div className='empty-comp'></div>}
            <div className="pagination-wrapper">
                <Pagination 
                    count={3} 
                    shape="rounded" 
                    sx={paginationSx}
                    onChange={handlePaginationChange}
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