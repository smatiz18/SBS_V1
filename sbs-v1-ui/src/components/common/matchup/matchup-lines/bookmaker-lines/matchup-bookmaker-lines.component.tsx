import { useEffect, useState } from "react";
import { Bookmakers } from "../../../../../models/enums/bookmakers";
import { MatchupLinesAndStats } from "../../../../../models/matchup-lines-and-stats";
import { BetOptions } from "../../../../../models/enums/bet-options";
import { Bookmaker, Market, Outcome } from "../../../../../models/odds/odds";
import { supportedTeamMarketsBySport, TeamBetTypes } from "../../../../../models/enums/team-bet-types";
import BettingOddsTable from "../betting-odds-table/betting-odds-table.component";
import { BettingOddsCell, BettingOddsTableParams } from "../../../../../models/component/betting-odds-table-params";
import { SportsCategories } from "../../../../../models/enums/sports-categories";
import { NbaTeamsMappedByName } from "../../../../../constants/nba";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { smallFontSelectSx, toggleButtonSx, toggleGroupSx } from "../../../../../models/form-styles/styles";
import { getBetTypeLabel } from "../../../../../utils/utils";
import { ListSubheader, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { GetEventOddsRequest } from "../../../../../models/services/get-event-odds-request";
import { OddsApiSports, sportsKeyToOddsApiSports } from "../../../../../models/enums/odds-api-sports";
import { OddsApiRegions } from "../../../../../models/enums/odds-api-regions";
import { OddsFormat } from "../../../../../models/enums/odds-format";
import { supportedPlayerMarketsBySport } from "../../../../../models/enums/player-bet-types";
import { getEventOdds } from "../../../../../services/odds/services";
import './matchup-bookmaker-lines.component.scss';

const MatchupBookmakerLines: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    const [bookmaker, setBookmaker] = useState(Bookmakers.DraftKings);
    const [betOption, setBetOption] = useState(BetOptions.Team);
    const [selectedPlayer, setSelectedPlayer] = useState(matchup.away.projectedPlayers[0] || '');

    const getEventOddsRequest = () => {
        const oddsApiSport = sportsKeyToOddsApiSports.get(matchup.odds?.sportKey || '') as OddsApiSports || null;
        const markets = betOption === BetOptions.Team ? 
            supportedTeamMarketsBySport.get(oddsApiSport) : 
            supportedPlayerMarketsBySport.get(oddsApiSport);
        const req: GetEventOddsRequest = {
            eventId: matchup.odds?.id || '',
            sports: oddsApiSport,
            regions: OddsApiRegions.US,
            markets: markets || [],
            oddsFormat: OddsFormat.American,
            bookmakers: Object.values(Bookmakers)
        };
        return req;
    };
   

    const awayPlayerOptions = matchup.away.projectedPlayers;
    const homePlayerOptions = matchup.home.projectedPlayers;

    useEffect(() => {
        const req = getEventOddsRequest();
        getEventOdds(req)
            .then((res) => {
                console.log(res.data);
            })
            .catch((e) => {
                console.error(e);
            });
    }, [betOption]);
    
    const handleBookmakerChange = (event: SelectChangeEvent) => {
      setBookmaker(event.target.value as Bookmakers);
    };

    const handleBetOptionsToggleChange = (event: any) => {
        setBetOption(event?.target.value);
    };

    const handleSelectedPlayerChange = (event: SelectChangeEvent) => {
        setSelectedPlayer(event.target.value);
    }

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
        <div className="matchup-bookmaker-lines-component-container">
            <div className="sportsbook-lines-container">
                <div className="sportsbook-lines-table-container">
                    <div className="table-actions">
                        <div className="bet-options-toggle-wrapper">
                            <ToggleButtonGroup
                                value={betOption}
                                exclusive
                                onChange={handleBetOptionsToggleChange}
                                aria-label="text alignment"
                                sx={toggleGroupSx}
                            >
                                <ToggleButton sx={toggleButtonSx} value={BetOptions.Team}>
                                    Team Lines
                                </ToggleButton>
                                <ToggleButton sx={toggleButtonSx} value={BetOptions.Player}>
                                    Player Lines
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
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
                        {
                            betOption === BetOptions.Player && 
                            <div className="select-wrapper">
                                <FormControl variant="standard" sx={{ width: '100%' }}>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={selectedPlayer}
                                        onChange={handleSelectedPlayerChange}
                                        sx={smallFontSelectSx}
                                    >
                                        <ListSubheader>Away</ListSubheader>
                                        {
                                            awayPlayerOptions.map((o) => (
                                                <MenuItem value={o}>{o}</MenuItem>
                                            ))
                                        }
                                        <ListSubheader>Home</ListSubheader>
                                        {
                                            homePlayerOptions.map((o) => (
                                                <MenuItem value={o}>{o}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                        }
                    </div>
                    <div className="table-wrapper">
                        {
                            matchup.odds?.bookmakers !== undefined && 
                            betOption === BetOptions.Team && 
                            <BettingOddsTable params={getBettingOddsTableParams()}/>
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}

export default MatchupBookmakerLines; 