import React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { Bookmakers } from "../../../../../models/enums/bookmakers";
import { MatchupLinesAndStats } from "../../../../../models/matchup-lines-and-stats";
import { BetOptions } from "../../../../../models/enums/bet-options";
import { Bookmaker, Market, Outcome } from "../../../../../models/odds/odds";
import { supportedTeamMarketsBySport, TeamBetTypes } from "../../../../../models/enums/team-bet-types";
import { BettingOddsCell, BettingOddsTableParams } from "../../../../../models/component/betting-odds-table-params";
import { SportsCategories } from "../../../../../models/enums/sports-categories";
import { NbaTeamsMappedByName } from "../../../../../constants/nba";
import { smallFontSelectSx } from "../../../../../models/form-styles/styles";
import { getBetTypeLabel } from "../../../../../utils/utils";
import { GetEventOddsRequest } from "../../../../../models/services/get-event-odds-request";
import { OddsApiSports, sportsKeyToOddsApiSports } from "../../../../../models/enums/odds-api-sports";
import { OddsApiRegions } from "../../../../../models/enums/odds-api-regions";
import { OddsFormat } from "../../../../../models/enums/odds-format";
import { supportedPlayerMarketsBySport } from "../../../../../models/enums/player-bet-types";
import { getEventOdds } from "../../../../../services/odds/services";
import { GetOddsResponse } from "../../../../../models/services/get-odds-response";
import { pelicansKingsPlayerOdds, rocketsWarriorsPlayersOdds } from "../../../../../test/nba-matchups-mocks";
import BettingOddsTable from "../betting-odds-table/betting-odds-table.component";
import './matchup-bookmaker-lines.component.scss';

const MatchupBookmakerLines: React.FC<{
    matchup: MatchupLinesAndStats,
    betOption: BetOptions
}> = ({ matchup, betOption }) => {
    /* consts ***********************************************************************/
    const USE_MOCKS = true;
    const [bookmaker, setBookmaker] = useState(Bookmakers.DraftKings);
    const [currentEventOdds, setCurrentEventOdds] = useState({} as GetOddsResponse);
    const oddsApiSport = sportsKeyToOddsApiSports.get(matchup.oddsEvent?.sportKey || '') as OddsApiSports || null;
    const getEventOddsRequest = () => {
        const markets = betOption === BetOptions.Team ?
            supportedTeamMarketsBySport.get(oddsApiSport) :
            supportedPlayerMarketsBySport.get(oddsApiSport);
        const req: GetEventOddsRequest = {
            eventId: matchup.oddsEvent?.id || '',
            sports: oddsApiSport,
            regions: OddsApiRegions.US,
            markets: markets || [],
            oddsFormat: OddsFormat.American,
            // bookmakers: Object.values(Bookmakers)
        } as any;
        return req;
    };
    /********************************************************************************/

    /* effects **********************************************************************/
    useEffect(() => {
        getEventOddsForBetOption(USE_MOCKS);
    }, []);

    useEffect(() => {
        getEventOddsForBetOption(USE_MOCKS);
    }, [betOption]);
    /********************************************************************************/

    /* services *********************************************************************/
    const getEventOddsForBetOption = (useMocks: boolean) => {
        const req = getEventOddsRequest();
        if (useMocks) {
            const oddsForEvent = [rocketsWarriorsPlayersOdds, pelicansKingsPlayerOdds]
                .find((respObj: any) => respObj.data.events[0].eventId === matchup.oddsEvent?.id)!;
            setCurrentEventOdds((oddsForEvent?.data || {}) as any);
        } else {
            getEventOdds(req)
                .then((res) => {
                    setCurrentEventOdds(res.data?.data);
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    }
    /********************************************************************************/

    /* event handlers ***************************************************************/
    const handleBookmakerChange = (event: SelectChangeEvent) => {
        setBookmaker(event.target.value as Bookmakers);
    };
    /********************************************************************************/  

    /* betting odds table funcs *****************************************************/
    function getBettingOddsTableRowOrdering() {
        switch (betOption) {
            case BetOptions.Team:
                /* maybe make only for team bet types */
                return [matchup.away.teamNickname, matchup.home.teamNickname];
            default:
                return undefined;
        }
    }

    function getBettingOddsTableColOrdering() {
        switch (betOption) {
            /* maybe make only for team bet types */
            case BetOptions.Team:
                return ['Spread', 'Total', 'Moneyline'];
            default:
                return undefined;
        }
    }

    function getBettingOddsTableParams() {
        return {
            bettingOddsCells: getBettingOddsCells(),
            rowOrdering: getBettingOddsTableRowOrdering(),
            colOrdering: getBettingOddsTableColOrdering(),
            betOption: betOption,
            bookmaker: bookmaker
        } as BettingOddsTableParams;
    }

    const teamBettingOddsCells = (sportsbook: Bookmaker) => {
        return sportsbook.markets.map((market: Market) => {
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

    function getBettingOddsCells() {
        let oddsCells: BettingOddsCell[] = [];
        const sportsbook = matchup.oddsEvent?.bookmakers.find((sportsbook: Bookmaker) =>
            sportsbook.title === bookmaker.toString()
        )!;

        if (sportsbook) {
            if (betOption === BetOptions.Team) {
                oddsCells = teamBettingOddsCells(sportsbook);
            } else {
                switch (oddsApiSport) {
                    case OddsApiSports.BasketballNba: {

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
                        {/* {
                            matchup.oddsEvent?.bookmakers !== undefined && 
                            betOption === BetOptions.Team && 
                            <BettingOddsTable params={getBettingOddsTableParams()}/>
                        } */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MatchupBookmakerLines; 