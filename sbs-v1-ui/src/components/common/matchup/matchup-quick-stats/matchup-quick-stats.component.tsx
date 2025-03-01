import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { BetOptions } from "../../../../models/enums/bet-options";
import { MatchupLinesAndStats } from "../../../../models/matchup-lines-and-stats";
import AvgsTable from "./avgs/avgs-table.component";
import _ from "lodash";
import Pagination from "@mui/material/Pagination";
import { paginationSx } from "../../../../models/form-styles/styles";
import PaginationItem from "@mui/material/PaginationItem";
import ChartAnalyzer from "./chart-analyzer/chart-analyzer.component";
import PastOccurrences from "./past-occurrences/past-occurrences.component";
import './matchup-quick-stats.component.scss';

const MatchupQuickStats: React.FC<{ 
    matchup: MatchupLinesAndStats, 
    betOption: BetOptions, 
    selectedPlayerName?: string 
}> = ({ matchup, betOption, selectedPlayerName }) => {
    /* consts ***********************************************************************/
    const getAvgsTable = () => {
        return <AvgsTable matchup={matchup} betOption={betOption} selectedPlayerName={selectedPlayerName}/>;
    };
    const getChartAnalyzer = () => {
        return <ChartAnalyzer matchup={matchup} betOption={betOption} selectedPlayerName={selectedPlayerName}/>;
    }
    const pastOccurences = <PastOccurrences />;
    const getPageToCompMap = (): Record<string, ReactElement> => {
        return {
            '1': getAvgsTable(),
            '2': getChartAnalyzer(),
            '3': pastOccurences
        };
    };
    const [pageToCompMap, setPageToCompMap] = useState(getPageToCompMap());
    const pageLabels = ['Game Averages', 'Chart Analyzer', 'Past Occurences'];
    const [currentPage, setCurrentPage] = useState(1);
    /********************************************************************************/

    /* effects **********************************************************************/
    useEffect(() => {
        console.log("SOMETHING CHANGED");
        setPageToCompMap(getPageToCompMap());
    }, [betOption, selectedPlayerName]);
    /********************************************************************************/

    /* event handlers ***************************************************************/
    const handlePaginationChange = (_: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    }
    /********************************************************************************/

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