import { useState } from "react";
import './matchup-bookmaker-lines.component.scss';
import { Bookmakers } from "../../../../../models/enums/bookmakers";
import { MatchupLinesAndStats } from "../../../../../models/matchup-lines-and-stats";
import { BetOptions } from "../../../../../models/enums/bet-options";
import { Bookmaker, Market, Outcome } from "../../../../../models/odds/odds";
import { TeamBetTypes } from "../../../../../models/enums/team-bet-types";
import BettingOddsTable from "../../../betting-odds-table/betting-odds-table.component";
import { BettingOddsCell, BettingOddsTableParams } from "../../../../../models/component/betting-odds-table-params";
import { SportsCategories } from "../../../../../models/enums/sports-categories";
import { NbaTeamsMappedByName } from "../../../../../constants/nba";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { selectSx } from "../../../../../models/form-styles/styles";
import { getBetTypeLabel } from "../../../../../utils/utils";

const MatchupBookmakerLines: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    const [bookmaker, setBookmaker] = useState(Bookmakers.DraftKings);
    const [betOption, setBetOption] = useState(BetOptions.Team);
    const [currentLine, setCurrentLine] = useState('TeamLines');
    const lineOptions = [{ label: 'Team Lines', value: 'TeamLines'}];
    
    const handleBookmakerChange = (event: SelectChangeEvent) => {
      setBookmaker(event.target.value as Bookmakers);
    };

    const handleLineOptionsChange = (event: SelectChangeEvent) => {
        setCurrentLine(event.target.value as string);
    };
    
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

    // TODO move styles to different file
    const dkToggle = {
        textTransform: 'none',
        border: `1px solid #ddd;`,
        fontFamily: 'IBM Plex Sans, sans-serif',
        fontSize: '0.8rem',  
        transition: 'background-color 0.3s, color 0.3s',
        backgroundColor: '#f9f9f9',
        color: '#a9a9a9',
        '&.Mui-selected': {
            backgroundColor: '#242424', 
            color: '#53d337',
        },
    };

    const fdToggle = {
        textTransform: 'none',
        border: `1px solid #ddd;`,
        fontFamily: 'IBM Plex Sans, sans-serif',
        fontSize: '0.8rem', 
        transition: 'background-color 0.3s, color 0.3s',
        backgroundColor: '#f9f9f9',
        color: '#a9a9a9',
        '&.Mui-selected': {
            backgroundColor: '#455058', 
            color: '#1493FF',
        },
    };

    const betMGMToggle = {
        textTransform: 'none',
        border: `1px solid #ddd;`,
        fontFamily: 'IBM Plex Sans, sans-serif',
        fontSize: '0.8rem', 
        transition: 'background-color 0.3s, color 0.3s',
        backgroundColor: '#f9f9f9',
        color: '#a9a9a9',
        '&.Mui-selected': {
            backgroundColor: '#000', 
            color: '#d4b962',
        },
    };

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
                                    value={currentLine}
                                    onChange={handleLineOptionsChange}
                                    sx={selectSx}
                                >
                                    {
                                        lineOptions.map((o) => (
                                            <MenuItem value={o.value}>{o.label}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <div className="select-wrapper">
                            <FormControl variant="standard" sx={{ width: '100%' }}>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={bookmaker}
                                    onChange={handleBookmakerChange}
                                    sx={selectSx}
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
                            matchup.odds?.bookmakers !== undefined && (<BettingOddsTable params={getBettingOddsTableParams()}/>)
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}

export default MatchupBookmakerLines; 