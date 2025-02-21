import React, { useEffect } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { Bookmakers } from "../../../../../models/enums/bookmakers";
import { MatchupLinesAndStats } from "../../../../../models/matchup-lines-and-stats";
import { BetOptions } from "../../../../../models/enums/bet-options";
import { Bookmaker, Market, Outcome } from "../../../../../models/odds/odds";
import { TeamBetTypes } from "../../../../../models/enums/team-bet-types";
import { BettingOddsCell, BettingOddsTableParams } from "../../../../../models/component/betting-odds-table-params";
import { SportsCategories } from "../../../../../models/enums/sports-categories";
import { NbaTeamsMappedByName } from "../../../../../constants/nba";
import { smallFontSelectSx } from "../../../../../models/form-styles/styles";
import { getBetTypeLabel } from "../../../../../utils/utils";
import { OddsApiSports } from "../../../../../models/enums/odds-api-sports";
import BettingOddsTable from "../betting-odds-table/betting-odds-table.component";
import { Event } from "../../../../../models/odds/odds";
import './matchup-bookmaker-lines.component.scss';
import { PlayerBetTypes } from "../../../../../models/enums/player-bet-types";
import _ from "lodash";

const MatchupBookmakerLines: React.FC<{
    matchup: MatchupLinesAndStats,
    betOption: BetOptions,
    eventOdds: Event,
    oddsApiSport: OddsApiSports,
    selectedPlayerName: string
}> = ({ matchup, betOption, eventOdds, oddsApiSport, selectedPlayerName }) => {
    /* consts ***********************************************************************/
    const [bookmaker, setBookmaker] = useState(Bookmakers.DraftKings);
    const [bettingOddsTableParams, setBettingOddsTableParams] = useState(undefined as any);
    /********************************************************************************/

    /* effects **********************************************************************/
    useEffect(() => {
        setBettingOddsTableParams(getBettingOddsTableParams());
    }, [betOption, bookmaker, selectedPlayerName]);
    /********************************************************************************/

    /* event handlers ***************************************************************/
    const handleBookmakerChange = (event: SelectChangeEvent) => {
        setBookmaker(event.target.value as Bookmakers);
    };
    /********************************************************************************/  

    /* betting odds table funcs *****************************************************/
    function getBettingOddsTableRowOrdering() {
        let rowOrdering = undefined;
        if (betOption === BetOptions.Team) {
            rowOrdering = [matchup.away.teamNickname, matchup.home.teamNickname];  
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

    function getBettingOddsTableColOrdering() {
        let colOrdering = undefined;
        if (betOption === BetOptions.Team) {
            colOrdering = ['Spread', 'Total', 'Moneyline'];  
        } else {
            switch (oddsApiSport) {
                case OddsApiSports.BasketballNba:
                    colOrdering = ['Over', 'Under'];
            }
        }
        return colOrdering;
    }

    function getBettingOddsTableParams() {
        return {
            bettingOddsCells: getBettingOddsCells(),
            rowOrdering: getBettingOddsTableRowOrdering(),
            colOrdering: getBettingOddsTableColOrdering(),
            betOption: betOption,
            bookmaker: bookmaker,
            description: betOption === BetOptions.Player ? selectedPlayerName : undefined
        } as BettingOddsTableParams;
    }

    const teamBettingOddsCells = (bookmakerOdds: Bookmaker) => {
        return bookmakerOdds.markets.map((market: Market) => {
            switch (market.key) {
                case TeamBetTypes.H2H.toString():
                    return market.outcomes.map((outcome: Outcome) => {
                        return {
                            colKey: getBetTypeLabel(TeamBetTypes.H2H),
                            rowKey: getTeamLabel(outcome.name),
                            point: outcome.point,
                            price: outcome.price > 0 ? `+${outcome.price}` : outcome.price,
                            description: outcome.description
                        } as BettingOddsCell;
                    });
                case TeamBetTypes.Spreads.toString():
                    return market.outcomes.map((outcome: Outcome) => {
                        return {
                            colKey: getBetTypeLabel(TeamBetTypes.Spreads),
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
                            colKey: getBetTypeLabel(TeamBetTypes.Totals),
                            rowKey: outcome.name === 'Over' ? matchup.away.teamNickname : matchup.home.teamNickname,
                            point: `${OULabel} ${outcome.point}`,
                            price: outcome.price > 0 ? `+${outcome.price}` : outcome.price,
                            description: outcome.description
                        } as BettingOddsCell;
                    });
                default:
                    return [];
            }
        }).flat();
    }

    const nbaPlayerBettingOddsCells = (bookmakerOdds: Bookmaker) => {
        const getOULabel = (outcome: Outcome) => outcome.name === 'Over' ? 'O' : 'U';
        const filteredBookmakerMarkets = _.cloneDeep(bookmakerOdds).markets.map((market: Market) => {
            market.outcomes = market.outcomes.filter((outcome: Outcome) => outcome.description === selectedPlayerName);
            return market;
        });
        return filteredBookmakerMarkets.map((market: Market) => {
            switch (market.key) {
                case PlayerBetTypes.PlayerPoints.toString():
                    return market.outcomes.map((outcome: Outcome) => {
                        return {
                            colKey: outcome.name,
                            rowKey: getBetTypeLabel(PlayerBetTypes.PlayerPoints),
                            point: `${getOULabel(outcome)} ${outcome.point}`,
                            price: outcome.price > 0 ? `+${outcome.price}` : outcome.price,
                            description: outcome.description
                        } as BettingOddsCell;
                    });
                case PlayerBetTypes.PlayerAssists.toString():
                    return market.outcomes.map((outcome: Outcome) => {
                        return {
                            colKey: outcome.name,
                            rowKey: getBetTypeLabel(PlayerBetTypes.PlayerAssists),
                            point: `${getOULabel(outcome)} ${outcome.point}`,
                            price: outcome.price > 0 ? `+${outcome.price}` : outcome.price,
                            description: outcome.description
                        } as BettingOddsCell;
                    });
                case PlayerBetTypes.PlayerRebounds.toString():
                    return market.outcomes.map((outcome: Outcome) => {
                        return {
                            colKey: outcome.name,
                            rowKey: getBetTypeLabel(PlayerBetTypes.PlayerRebounds),
                            point: `${getOULabel(outcome)} ${outcome.point}`,
                            price: outcome.price > 0 ? `+${outcome.price}` : outcome.price,
                            description: outcome.description
                        } as BettingOddsCell;
                    });

                case PlayerBetTypes.PlayerThrees.toString():
                    return market.outcomes.map((outcome: Outcome) => {
                        return {
                            colKey: outcome.name,
                            rowKey: getBetTypeLabel(PlayerBetTypes.PlayerThrees),
                            point: `${getOULabel(outcome)} ${outcome.point}`,
                            price: outcome.price > 0 ? `+${outcome.price}` : outcome.price,
                            description: outcome.description
                        } as BettingOddsCell;
                    });
                case PlayerBetTypes.PlayerPointsAssists.toString():
                    return market.outcomes.map((outcome: Outcome) => {
                        return {
                            colKey: outcome.name,
                            rowKey: getBetTypeLabel(PlayerBetTypes.PlayerPointsAssists),
                            point: `${getOULabel(outcome)} ${outcome.point}`,
                            price: outcome.price > 0 ? `+${outcome.price}` : outcome.price,
                            description: outcome.description
                        } as BettingOddsCell;
                    });
                case PlayerBetTypes.PlayerPointsRebounds.toString():
                    return market.outcomes.map((outcome: Outcome) => {
                        return {
                            colKey: outcome.name,
                            rowKey: getBetTypeLabel(PlayerBetTypes.PlayerPointsRebounds),
                            point: `${getOULabel(outcome)} ${outcome.point}`,
                            price: outcome.price > 0 ? `+${outcome.price}` : outcome.price,
                            description: outcome.description
                        } as BettingOddsCell;
                    });
                case PlayerBetTypes.PlayerPointsReboundsAssists.toString():
                    return market.outcomes.map((outcome: Outcome) => {
                        return {
                            colKey: outcome.name,
                            rowKey: getBetTypeLabel(PlayerBetTypes.PlayerPointsReboundsAssists),
                            point: `${getOULabel(outcome)} ${outcome.point}`,
                            price: outcome.price > 0 ? `+${outcome.price}` : outcome.price,
                            description: outcome.description
                        } as BettingOddsCell;
                    });
                default:
                        return [];
                }
        }).flat();
    }

    function getBettingOddsCells() {
        let oddsCells: BettingOddsCell[] = [];
        
        const bookmakerOdds = eventOdds.bookmakers.find((sportsbook: Bookmaker) =>
            sportsbook.title === bookmaker.toString()
        )!;

        if (bookmakerOdds) {
            if (betOption === BetOptions.Team) {
                oddsCells = teamBettingOddsCells(bookmakerOdds);
            } else {
                switch (oddsApiSport) {
                    case OddsApiSports.BasketballNba: {
                        oddsCells = nbaPlayerBettingOddsCells(bookmakerOdds);
                        break;
                    }
                }
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
    /********************************************************************************/

    return (
        <div className="matchup-bookmaker-lines-component-container">
            <div className="sportsbook-lines-container">
                <div className="sportsbook-lines-table-container">
                    <div className="table-actions">
                        <div className="select-wrapper">
                            <FormControl variant="standard" sx={{ width: '100%' }}>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={bookmaker}
                                    onChange={handleBookmakerChange}
                                    sx={smallFontSelectSx}
                                >
                                    {
                                        Object.values(Bookmakers).map((o) => (
                                            <MenuItem value={o}>{o}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className="table-wrapper">
                        {
                            bettingOddsTableParams &&
                            <BettingOddsTable params={bettingOddsTableParams}/>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MatchupBookmakerLines; 