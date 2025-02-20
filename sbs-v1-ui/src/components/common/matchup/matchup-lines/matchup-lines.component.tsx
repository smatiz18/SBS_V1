import Pagination from "@mui/material/Pagination";
import { MatchupLinesAndStats } from "../../../../models/matchup-lines-and-stats";
import MatchupBookmakerLines from "./bookmaker-lines/matchup-bookmaker-lines.component";
import MatchupOptimalOdds from "./optimal-odds/matchup-optimal-odds.component";
import PaginationItem from "@mui/material/PaginationItem";
import { paginationSx } from "../../../../models/form-styles/styles";
import { ChangeEvent, ReactElement, useState } from "react";
import './matchup-lines.component.scss';
import { BetOptions } from "../../../../models/enums/bet-options";

const MatchupLines: React.FC<{matchup: MatchupLinesAndStats, betOption: BetOptions}> = ({matchup, betOption}) => {  
    // move matchup lines selectors to this component
    /* consts ***********************************************************************/
    const pageLabels = ['Bookmaker Lines', 'Optimal Odds'];
    const bookmakerLinesComp = <MatchupBookmakerLines matchup={{...matchup}} betOption={betOption}/>;
    const optimalOddsComp = <MatchupOptimalOdds matchup={{ ...matchup }} betOption={BetOptions.Team} optimalOdds={[]}/>;
    const pageToCompMap: Record<string, ReactElement> = {
        '1': bookmakerLinesComp,
        '2': optimalOddsComp
    };
    const [currentPage, setCurrentPage] = useState(1);
    /********************************************************************************/

    /* event handlers ***************************************************************/
    const handlePaginationChange = (_: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    }
    /********************************************************************************/

    return (
        <div className='matchup-lines-container'>
             <div className="header-container">
                <h3>Matchup Lines</h3>
                <div className="line"></div>
            </div>
            {pageToCompMap[currentPage.toString()] || <div className='empty-comp'></div>}
            <div className="pagination-wrapper">
                <Pagination 
                    count={2} 
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
    )
}

export default MatchupLines;