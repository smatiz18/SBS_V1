import { useState } from "react";
import './matchup-lines-and-stats.component.scss';
import { Bookmakers } from "../../../models/enums/bookmakers";
import { MatchupLinesAndStats } from "../../../models/matchup-lines-and-stats";
import { BetOptions } from "../../../models/enums/bet-options";
import { Bookmaker, Market, Outcome } from "../../../models/odds/odds";
import { TeamBetTypes } from "../../../models/enums/team-bet-types";
import BettingOddsTable from "../betting-odds-table/betting-odds-table.component";
import { BettingOddsCell } from "../../../models/component/betting-odds-table-params";

const MatchupLinesAndStatsComponent: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    const [bookmaker, setBookmaker] = useState(Bookmakers.DraftKings);
    const [betOption, setBetOption] = useState(BetOptions.Team);

    function getBettingOddsCells() {
        let oddsCells: BettingOddsCell[] = [];
        const sportsbook = matchup.odds?.bookmakers.find((sportsbook: Bookmaker) => {
            return sportsbook.title === bookmaker.toString()
        })!;
        
        if (sportsbook) {
            if (betOption === BetOptions.Team) {
                oddsCells = sportsbook.markets.map((market: Market) => {
                    switch (market.key) {
                        case TeamBetTypes.H2H.toString():  
                            return market.outcomes.map((outcome: Outcome) => {
                                return {
                                    colKey: TeamBetTypes.H2H,
                                    colLabel: 'Moneyline',
                                    rowKey: outcome.name,
                                    rowLabel: outcome.name, 
                                    point: outcome.point, 
                                    price: outcome.price,
                                    description: outcome.description
                                } as BettingOddsCell; 
                            });
                        case TeamBetTypes.Spreads.toString():
                            return market.outcomes.map((outcome: Outcome) => {
                                return {
                                    colKey: TeamBetTypes.Spreads,
                                    colLabel: 'Spread',
                                    rowKey: outcome.name,
                                    rowLabel: outcome.name, 
                                    point: outcome.point, 
                                    price: outcome.price,
                                    description: outcome.description
                                } as BettingOddsCell; 
                            });
                        case TeamBetTypes.Totals.toString():          
                            return market.outcomes.map((outcome: Outcome) => {
                                return {
                                    colKey: TeamBetTypes.Totals,
                                    colLabel: 'Total',
                                    rowKey: outcome.name === 'Over' ? matchup.away.teamName : matchup.home.teamName,
                                    rowLabel: outcome.name === 'Over' ? matchup.away.teamName : matchup.home.teamName, 
                                    point: outcome.point, 
                                    price: outcome.price,
                                    description: outcome.description
                                } as BettingOddsCell; 
                            });
                        default:
                            return [];
                    }
                }).flat();
            }
        }
        return oddsCells;
    }

    return (
        <div className="matchup-lines-and-stats-component-container">
            <div className="header">
                <h3>Sportsbook Lines and Stats</h3>
            </div>
            <div className="content">
                <div className="sportsbook-lines-container">
                    {
                        getBettingOddsCells().length > 1 &&(<BettingOddsTable params={{ bettingOddsCells: getBettingOddsCells()} as any}/>)
                    }
                </div>
            </div>
        </div>
    );
}

export default MatchupLinesAndStatsComponent;