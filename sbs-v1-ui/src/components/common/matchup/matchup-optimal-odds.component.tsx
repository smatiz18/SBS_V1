import { useState } from "react";
import { MatchupLinesAndStats } from "../../../models/matchup-lines-and-stats";
import { BetOptions } from "../../../models/enums/bet-options";
import { OptimalOdds } from "../../../models/services/get-odds-response";
import { getBetTypeLabel } from "../../../utils/utils";
import { BettingOddsCell } from "../../../models/component/betting-odds-table-params";
import { TeamBetTypes } from "../../../models/enums/team-bet-types";
import { OptimalOddsTableParams } from "../../../models/component/optimal-odds-table-params";
import OptimalOddsTable from "../optimal-odds-table/optimal-odds-table.component";
import './matchup-optimal-odds.component.scss';

const MatchupOptimalOdds: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    const [betOption, setBetOption] = useState(BetOptions.Team);
    const [currentLine, setCurrentLine] = useState('TeamLines');
    
    /** this is assuming TeamLines when player lines are implemented, implement that logic */
    function getOptimalOddsTableRowOrdering() {
        switch (betOption) {
            /* maybe make only for team bet types */
            case BetOptions.Team:
                return ['Spread', 'Moneyline']; 
            default:
                return undefined;
        }
    }

    function getOptimalOddsTotalsRowOrdering() {
        return ['Over', 'Under'];
    }

    function getOptimalOddsTableColOrdering() {
        return ['Odds', 'Sportsbook']
    }
    
    function transformOptimalOddsToOptimalOddsTableRow(optimalOdds: OptimalOdds) {
        return [
            {
                rowKey: optimalOdds.betType === TeamBetTypes.Totals ? optimalOdds.name : getBetTypeLabel(optimalOdds.betType),
                colKey: 'Odds', 
                point: optimalOdds.point, 
                price: optimalOdds.price > 0 ? `+${optimalOdds.price}` : optimalOdds.price, 
                bookmaker: optimalOdds.bookmaker
            } as BettingOddsCell,
            {
                rowKey: optimalOdds.betType === TeamBetTypes.Totals ? optimalOdds.name : getBetTypeLabel(optimalOdds.betType),
                colKey: 'Sportsbook',
                price: optimalOdds.bookmaker,
                bookmaker: optimalOdds.bookmaker
            }
        ];
    }
    
    function getOptimalOddsTableParams() {
        let optimalOddsTableParams;
        if (betOption === BetOptions.Team) {
            const awayTeamOptimalOddsCells = matchup.optimalOdds?.filter(
                (optimalOdds: OptimalOdds) => optimalOdds.name === matchup.away.teamName
            )
            .flatMap(transformOptimalOddsToOptimalOddsTableRow);

            const homeTeamOptimalOddsCells = matchup.optimalOdds?.filter(
                (optimalOdds: OptimalOdds) => optimalOdds.name === matchup.home.teamName
            )
            .flatMap(transformOptimalOddsToOptimalOddsTableRow);

            const totalsOddsCells = matchup.optimalOdds?.filter(
                (optimalOdds: OptimalOdds) => optimalOdds.betType === TeamBetTypes.Totals
            )
            .flatMap(transformOptimalOddsToOptimalOddsTableRow);

            optimalOddsTableParams = [
                {
                    optimalOddsCells: awayTeamOptimalOddsCells,
                    rowOrdering: getOptimalOddsTableRowOrdering(),
                    colOrdering: getOptimalOddsTableColOrdering(),
                    betOption: betOption,
                    description: matchup.away.teamNickname
                } as OptimalOddsTableParams,
                {
                    optimalOddsCells: homeTeamOptimalOddsCells,
                    rowOrdering: getOptimalOddsTableRowOrdering(),
                    colOrdering: getOptimalOddsTableColOrdering(),
                    betOption: betOption,
                    description: matchup.home.teamNickname
                } as OptimalOddsTableParams,
                {
                    optimalOddsCells: totalsOddsCells,
                    rowOrdering: getOptimalOddsTotalsRowOrdering(),
                    colOrdering: getOptimalOddsTableColOrdering(),
                    betOption: betOption,
                    description: getBetTypeLabel(TeamBetTypes.Totals)
                } as OptimalOddsTableParams
            ];
        }

        return optimalOddsTableParams || [];
    }

    return (
        <div className="matchup-optimal-odds-component-container">
            <div className="optimal-odds-container">
                <div className="header-container">
                    <h3>Optimal Odds</h3>
                    <div className="line"></div>
                </div>
                <div className="optimal-odds-tables-container">
                    <div className="optimal-odds-tables">
                        { 
                            matchup.optimalOdds !== undefined && getOptimalOddsTableParams()
                                .map((optimalOddsTableParams) => (<OptimalOddsTable params={optimalOddsTableParams}/>))
                        }
                    </div>
                </div>
            </div>
        </div>
    ); 
}

export default MatchupOptimalOdds;