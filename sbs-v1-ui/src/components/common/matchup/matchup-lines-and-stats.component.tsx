import { useState } from "react";
import './matchup-lines-and-stats.component.scss';
import { Bookmakers } from "../../../models/enums/bookmakers";
import { MatchupLinesAndStats } from "../../../models/matchup-lines-and-stats";
import { BetOptions } from "../../../models/enums/bet-options";
import { Bookmaker, Market, Outcome } from "../../../models/odds/odds";
import { TeamBetTypes } from "../../../models/enums/team-bet-types";
import BettingOddsTable from "../betting-odds-table/betting-odds-table.component";

const MatchupLinesAndStatsComponent: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    const [bookmaker, setBookmaker] = useState(Bookmakers.DraftKings);
    const [betOption, setBetOption] = useState(BetOptions.Team);
    const [entityName, setEntityName] = useState(matchup.odds?.homeTeam);
    const [entityNameNickname, setEntityNameNickname] = useState(matchup.home.teamNickname);
    
    function getTeamLinesContent() {
        const sportsbook = matchup.odds?.bookmakers.find((sportsbook: Bookmaker) => {
            return sportsbook.title === bookmaker.toString()
        })!;
        let oddsContent: any = <p>Unable to load bookmaker odds.</p>;
        if (sportsbook) {
            oddsContent = sportsbook.markets.map((market: Market) => {
                let outcome = market.outcomes
                    .find((outcome: Outcome) => outcome.name === entityName)!;
            
                switch (market.key) {
                    case TeamBetTypes.H2H.toString():     
                        return (
                            <div className="team-line">
                                <p>Money Line</p>
                                <p>{`odds: ${outcome.price}`}</p>
                            </div>
                        );
                    case TeamBetTypes.Spreads.toString():
                        return (
                            <div className="team_line">
                                <p>Spread</p>
                                <p>{`spread: ${outcome.point}`}</p>
                                <p>{`odds: ${outcome.price}`}</p>
                            </div>
                        );
                    case TeamBetTypes.Totals.toString():   
                        const overOutcome = market.outcomes
                            .find((outcome: Outcome) => outcome.name === 'Over')!;
                        const underOutcome = market.outcomes
                            .find((outcome: Outcome) => outcome.name === 'Over')!;
                        return (
                            <div className="team-line">
                                <p>O/U</p>
                                <p>{`over: ${overOutcome.point}`}</p>
                                <p>{`odds: ${overOutcome.price}`}</p>
                                <p>{`under: ${underOutcome.point}`}</p>
                                <p>{`odds: ${underOutcome.price}`}</p>                            
                            </div>
                        );
                }
            })!;
        }

        return (
            <div className="team-lines-content">
                {oddsContent}
            </div>
        );
    }

    return (
        <div className="matchup-lines-and-stats-component-container">
            <div className="header">Sportsbook Lines and Stats</div>
            <div className="content">
                <div className="sportsbook-lines-container">
                    <BettingOddsTable params={{ bettingOddsCells: []} as any}/>
                </div>
            </div>
        </div>
    );
}

export default MatchupLinesAndStatsComponent;