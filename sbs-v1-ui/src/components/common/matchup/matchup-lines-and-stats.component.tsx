import { useState } from "react";
import './matchup-lines-and-stats.component.scss';
import { Bookmakers } from "../../../models/enums/bookmakers";
import { MatchupLinesAndStats } from "../../../models/matchup-lines-and-stats";
import { BetOptions } from "../../../models/enums/bet-options";
import { Bookmaker, Market, Outcome } from "../../../models/odds/odds";
import { TeamBetTypes } from "../../../models/enums/team-bet-types";
import BettingOddsTable from "../betting-odds-table/betting-odds-table.component";
import { BettingOddsCell } from "../../../models/component/betting-odds-table-params";
import { SportsCategories } from "../../../models/enums/sports-categories";
import { NbaTeamsMappedByName } from "../../../constants/nba";
import { Item, Root } from "@radix-ui/react-toggle-group";

const MatchupLinesAndStatsComponent: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    const [bookmaker, setBookmaker] = useState(Bookmakers.DraftKings);
    const [betOption, setBetOption] = useState(BetOptions.Team);

    function getRowOrdering() {
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA:
                return [matchup.away.teamNickname, matchup.home.teamNickname]; 
            default:
                return undefined;
        }
    }

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
                                    colKey: 'Moneyline',
                                    rowKey: getTeamLabel(outcome.name),
                                    point: outcome.point, 
                                    price: outcome.price > 0 ? `+${outcome.price}` : outcome.price,
                                    description: outcome.description
                                } as BettingOddsCell; 
                            });
                        case TeamBetTypes.Spreads.toString():
                            return market.outcomes.map((outcome: Outcome) => {
                                return {
                                    colKey: 'Spread',
                                    rowKey: getTeamLabel(outcome.name),
                                    point: outcome.point, 
                                    price: outcome.price > 0 ? `+${outcome.price}` : outcome.price,
                                    description: outcome.description
                                } as BettingOddsCell; 
                            });
                        case TeamBetTypes.Totals.toString():          
                            return market.outcomes.map((outcome: Outcome) => {
                                const OULabel = outcome.name === 'Over' ? 'O' : 'U';
                                return {
                                    colKey: 'Total',
                                    rowKey: outcome.name === 'Over' ? matchup.away.teamNickname : matchup.home.teamNickname,
                                    point:`${OULabel} ${outcome.point}`,
                                    price: outcome.price > 0 ? `+${outcome.price}` : outcome.price,
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

    function getTeamLabel(name: string) {
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA:
                return NbaTeamsMappedByName[name].teamNickname;
            default:
                 return name;
        }
    }

    return (
        <div className="matchup-lines-and-stats-component-container">
            <div className="header">
                <h3>Sportsbook Lines and Stats</h3>
            </div>
            <div className="market-toggle-container">
                <Root
                    className="ToggleGroup"
                    type="single"
                    defaultValue="center"
                    aria-label="Text alignment"
                >
                    <Item
                        className="ToggleGroupItem"
                        value="left"
                        aria-label="Left aligned"
                    >
                        DraftKings
                    </Item>
                    <Item
                        className="ToggleGroupItem"
                        value="center"
                        aria-label="Center aligned"
                    >
                        FanDuel
                    </Item>
                    <Item
                        className="ToggleGroupItem"
                        value="right"
                        aria-label="Right aligned"
                    >
                        BetMGM
                    </Item>
                </Root>
            </div>
            <div className="content">
                <div className="sportsbook-lines-container">
                    {
                        getBettingOddsCells().length > 1 &&(<BettingOddsTable params={{ bettingOddsCells: getBettingOddsCells(), rowOrdering: getRowOrdering() } as any}/>)
                    }
                </div>
            </div>
        </div>
    );
}

export default MatchupLinesAndStatsComponent;