import { MatchupLinesAndStats } from "../../../../../models/matchup-lines-and-stats";
import { BetOptions } from "../../../../../models/enums/bet-options";
import { OptimalOdds } from "../../../../../models/services/get-odds-response";
import { getBetTypeLabel } from "../../../../../utils/utils";
import { BettingOddsCell } from "../../../../../models/component/betting-odds-table-params";
import { TeamBetTypes } from "../../../../../models/enums/team-bet-types";
import { OptimalOddsTableParams } from "../../../../../models/component/optimal-odds-table-params";
import OptimalOddsTable from "../optimal-odds-table/optimal-odds-table.component";
import { OddsApiSports } from "../../../../../models/enums/odds-api-sports";
import { useEffect, useState } from "react";
import { PlayerBetTypes } from "../../../../../models/enums/player-bet-types";
import './matchup-optimal-odds.component.scss';

const MatchupOptimalOdds: React.FC<{
    matchup: MatchupLinesAndStats, 
    betOption: BetOptions, 
    teamOptimalOdds?: OptimalOdds[],
    playerOptimalOdds?: Record<string, OptimalOdds[]>
    oddsApiSport: OddsApiSports,
    selectedPlayerName: string
}> = ({matchup, betOption, teamOptimalOdds, playerOptimalOdds, oddsApiSport, selectedPlayerName}) => {
    /* table row / col configs ******************************************************/
    const optimalOddsTableRowOrdering = () => {
        let rowOrdering = undefined;
        if (betOption === BetOptions.Team) {
            rowOrdering = ['Spread', 'Moneyline'];  
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
        return ['Odds']
    }

    const playerOptimalOddsTableColOrdering = () => {
        return ['Over', 'Under'];
    }
    /********************************************************************************/
    
    /* consts ***********************************************************************/
    const [optimalOddsTableParams, setOptimalOddsTableParams] = useState([] as any);
    /********************************************************************************/
    /* effects **********************************************************************/
    useEffect(() => {
        setOptimalOddsTableParams(getOptimalOddsTableParams());
    }, [betOption, selectedPlayerName, oddsApiSport]);    
    /********************************************************************************/
    
    /* transformers *****************************************************************/
    function transformTeamOptimalOddsToOptimalOddsTableRow(optimalOdds: OptimalOdds) {
        return {
            rowKey: optimalOdds.betType === TeamBetTypes.Totals ? optimalOdds.name : getBetTypeLabel(optimalOdds.betType),
            colKey: 'Odds', 
            point: optimalOdds.point, 
            price: optimalOdds.price > 0 ? `+${optimalOdds.price}` : optimalOdds.price, 
            bookmaker: optimalOdds.bookmaker
        };
    }

    function transformPlayerOptimalOddsToOptimalOddsTableRow(optimalOdds: OptimalOdds) {
        return {
            rowKey: getBetTypeLabel(optimalOdds.betType),
            colKey: optimalOdds.name, 
            point: optimalOdds.point, 
            price: optimalOdds.price > 0 ? `+${optimalOdds.price}` : optimalOdds.price, 
            bookmaker: optimalOdds.bookmaker
        } as BettingOddsCell;
    }
    /********************************************************************************/
    
    /* table param funcs ************************************************************/
    function getOptimalOddsTableParams() {
        let optimalOddsTableParams;
        if (teamOptimalOdds && betOption === BetOptions.Team) {
            const awayTeamOptimalOddsCells = teamOptimalOdds.filter(
                (optimalOdds: OptimalOdds) => optimalOdds.name === matchup.away.teamName
            )
            .map(transformTeamOptimalOddsToOptimalOddsTableRow);

            const homeTeamOptimalOddsCells = teamOptimalOdds.filter(
                (optimalOdds: OptimalOdds) => optimalOdds.name === matchup.home.teamName
            )
            .map(transformTeamOptimalOddsToOptimalOddsTableRow);

            const totalsOddsCells = teamOptimalOdds.filter(
                (optimalOdds: OptimalOdds) => optimalOdds.betType === TeamBetTypes.Totals
            )
            .map(transformTeamOptimalOddsToOptimalOddsTableRow);

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
        } else {
            const selectedPlayerOptimalOdds = ((playerOptimalOdds || {})[selectedPlayerName] || [])
                .map((optimalOdds: OptimalOdds) => transformPlayerOptimalOddsToOptimalOddsTableRow(optimalOdds));
            
            optimalOddsTableParams = [
                {
                    optimalOddsCells: selectedPlayerOptimalOdds,
                    rowOrdering: optimalOddsTableRowOrdering(),
                    colOrdering: playerOptimalOddsTableColOrdering(),
                    betOption: betOption,
                    description: selectedPlayerName
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
                    <div className={`${optimalOddsTableParams.length <= 1 ? 'single-' : ''}optimal-odds-tables`}>
                        { 
                            (playerOptimalOdds !== undefined || teamOptimalOdds !== undefined) && optimalOddsTableParams
                                .map((currParams: any) => (<OptimalOddsTable params={currParams} numTables={optimalOddsTableParams.length}/>))
                        }
                    </div>
                </div>
            </div>
        </div>
    ); 
}

export default MatchupOptimalOdds;