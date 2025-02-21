import { MatchupLinesAndStats } from "../../../../../models/matchup-lines-and-stats";
import { BetOptions } from "../../../../../models/enums/bet-options";
import { OptimalOdds } from "../../../../../models/services/get-odds-response";
import { getBetTypeLabel } from "../../../../../utils/utils";
import { BettingOddsCell } from "../../../../../models/component/betting-odds-table-params";
import { TeamBetTypes } from "../../../../../models/enums/team-bet-types";
import { OptimalOddsTableParams } from "../../../../../models/component/optimal-odds-table-params";
import OptimalOddsTable from "../optimal-odds-table/optimal-odds-table.component";
import { OddsApiSports } from "../../../../../models/enums/odds-api-sports";
import { useEffect } from "react";
import { PlayerBetTypes } from "../../../../../models/enums/player-bet-types";
import './matchup-optimal-odds.component.scss';

const MatchupOptimalOdds: React.FC<{
    matchup: MatchupLinesAndStats, 
    betOption: BetOptions, 
    optimalOdds: OptimalOdds[],
    oddsApiSport: OddsApiSports
}> = ({matchup, betOption, optimalOdds, oddsApiSport}) => {

    /* effects **********************************************************************/
    useEffect(() => {
        console.log(optimalOdds);
    }, []);    
    /********************************************************************************/

    
    /* table row / col configs ******************************************************/
    const optimalOddsTableRowOrdering = () => {
        let rowOrdering = undefined;
                if (betOption === BetOptions.Team) {
                    rowOrdering = ['Spread', 'Moneyline '];  
                } else {
                    switch (oddsApiSport) {
                        case OddsApiSports.BasketballNba:
                            rowOrdering = [
                                getBetTypeLabel(PlayerBetTypes.PlayerPoints),
                                getBetTypeLabel(PlayerBetTypes.PlayerAssists),
                                getBetTypeLabel(PlayerBetTypes.PlayerRebounds),
                                getBetTypeLabel(PlayerBetTypes.PlayerPointsAssists),
                                getBetTypeLabel(PlayerBetTypes.PlayerPointsRebounds),
                                getBetTypeLabel(PlayerBetTypes.PlayerPointsReboundsAssists),
                                getBetTypeLabel(PlayerBetTypes.PlayerThrees)
                            ];
                    }
                }
                return rowOrdering;
    }

    const teamOptimalOddsTotalsRowOrdering = () => {
        return ['Over', 'Under'];
    }

    const teamOptimalOddsTableColOrdering = () => {
        return ['Odds', 'Sportsbook']
    }

    const playerOptimalOddsTableColOrdering = () => {
        return ['Over', 'Under', 'Sportsbook'];
    }
    /********************************************************************************/
    
    /* transformers *****************************************************************/
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
    /********************************************************************************/
    
    /* table param funcs ************************************************************/
    function getOptimalOddsTableParams() {
        let optimalOddsTableParams;
        if (betOption === BetOptions.Team) {
            const awayTeamOptimalOddsCells = optimalOdds.filter(
                (optimalOdds: OptimalOdds) => optimalOdds.name === matchup.away.teamName
            )
            .flatMap(transformOptimalOddsToOptimalOddsTableRow);

            const homeTeamOptimalOddsCells = optimalOdds.filter(
                (optimalOdds: OptimalOdds) => optimalOdds.name === matchup.home.teamName
            )
            .flatMap(transformOptimalOddsToOptimalOddsTableRow);

            const totalsOddsCells = optimalOdds.filter(
                (optimalOdds: OptimalOdds) => optimalOdds.betType === TeamBetTypes.Totals
            )
            .flatMap(transformOptimalOddsToOptimalOddsTableRow);

            optimalOddsTableParams = [
                {
                    optimalOddsCells: awayTeamOptimalOddsCells,
                    rowOrdering: optimalOddsTableRowOrdering(),
                    colOrdering: teamOptimalOddsTableColOrdering(),
                    betOption: betOption,
                    description: matchup.away.teamNickname
                } as OptimalOddsTableParams,
                {
                    optimalOddsCells: homeTeamOptimalOddsCells,
                    rowOrdering: optimalOddsTableRowOrdering(),
                    colOrdering: teamOptimalOddsTableColOrdering(),
                    betOption: betOption,
                    description: matchup.home.teamNickname
                } as OptimalOddsTableParams,
                {
                    optimalOddsCells: totalsOddsCells,
                    rowOrdering: teamOptimalOddsTotalsRowOrdering(),
                    colOrdering: teamOptimalOddsTableColOrdering(),
                    betOption: betOption,
                    description: getBetTypeLabel(TeamBetTypes.Totals)
                } as OptimalOddsTableParams
            ];
        }
        return optimalOddsTableParams || [];
    }
    /********************************************************************************/

    return (
        <div className="matchup-optimal-odds-component-container">
            <div className="optimal-odds-container">
                <div className="optimal-odds-tables-container">
                    <div className="optimal-odds-tables">
                        { 
                            optimalOdds !== undefined && getOptimalOddsTableParams()
                                .map((optimalOddsTableParams) => (<OptimalOddsTable params={optimalOddsTableParams}/>))
                        }
                    </div>
                </div>
            </div>
        </div>
    ); 
}

export default MatchupOptimalOdds;