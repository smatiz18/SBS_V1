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
import TooltipIcon from "../../tooltip/tooltip-icon";
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
                <TooltipIcon description={
`Past Occurrences
\t- season = which season you would like to view data from
    \t\tif you want to view 2024-2025 season data input 2024
    \t\tif you want to view 2023-2024 season data input 2023 etc

\t- seasonType = [REGULAR, PLAYOFF, ALL]
    \t\tif you want to view only PLAYOFF games input PLAYOFF
    \t\tif you want to view PLAYOFF + REGULAR season games input ALL

\t- Player Historical Stats query example
    \t\t'How many times has LeBron James scored over 30 points 
    \t\t and over 5 assists in all regular season games this season?'
        \t\t\tAND
        \t\t\tseason = 2024
        \t\t\tseasonType = REGULAR
        \t\t\tfirstname = LeBron
        \t\t\tlastname = James
        \t\t\tpoints > 30
        \t\t\tassists > 5

\t- Team Historical Stats query example
    \t\t'How many times have the Lakers scored over 120 total points 
    \t\t when they have scored less than 30 points in q1 in all games this season?'
        \t\t\tAND
        \t\t\tseason = 2024
        \t\t\tseasonType = ALL
        \t\t\tteamNickname = Lakers 
        \t\t\tpoints > 120
        \t\t\tq1 < 30`
    
} isLightMode={true} />
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