import { useState } from "react";
import './matchup-lines-and-stats.component.scss';
import { Bookmakers } from "../../../models/enums/bookmakers";
import { MatchupLinesAndStats } from "../../../models/matchup-lines-and-stats";
import { BetOptions } from "../../../models/enums/bet-options";
import { Bookmaker, Market, Outcome } from "../../../models/odds/odds";
import { TeamBetTypes } from "../../../models/enums/team-bet-types";
import BettingOddsTable from "../betting-odds-table/betting-odds-table.component";
import { BettingOddsCell, BettingOddsTableParams } from "../../../models/component/betting-odds-table-params";
import { SportsCategories } from "../../../models/enums/sports-categories";
import { NbaTeamsMappedByName } from "../../../constants/nba";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React from "react";
import OptimalOddsTable from "../optimal-odds-table/optimal-odds-table.component";

const MatchupLinesAndStatsComponent: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    const [bookmaker, setBookmaker] = useState(Bookmakers.DraftKings);
    const [betOption, setBetOption] = useState(BetOptions.Team);
    const [currentLine, setCurrentLine] = useState('TeamLines');
    const lineOptions = [{ label: 'Team Lines', value: 'TeamLines'}];
    
    const handleBookmakerChange = (
      _event: React.MouseEvent<HTMLElement>,
      bookmaker: string,
    ) => {
      setBookmaker(bookmaker as Bookmakers);
    };

    const handleLineOptionsChange = (event: SelectChangeEvent) => {
        setCurrentLine(event.target.value as string);
      };
    

    function getBettingOddsTableRowOrdering() {
        switch (matchup.sportsCategory) {
            case SportsCategories.NBA:
                /* maybe make only for team bet types */
                return [matchup.away.teamNickname, matchup.home.teamNickname]; 
            default:
                return undefined;
        }
    }

    function getBettingOddsTableColOrdering() {
        switch (matchup.sportsCategory) {
            /* maybe make only for team bet types */
            case SportsCategories.NBA:
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

    const selectSx = {
        fontFamily: 'IBM Plex Sans, sans-serif',
    };

    return (
        <div className="matchup-lines-and-stats-component-container">
            <div className="sportsbook-lines-container">
                <div className="header-container">
                    <div className="header-wrapper">
                        <h3>Sportsbook Lines</h3>
                    </div>
                    <div className="market-toggle-container">
                        <ToggleButtonGroup size="small"
                            value={bookmaker.toString()}
                            exclusive
                            onChange={handleBookmakerChange}
                            aria-label="Small sizes"
                        >
                            <ToggleButton value="DraftKings" sx={dkToggle}>DraftKings</ToggleButton>
                            <ToggleButton value="FanDuel" sx={fdToggle}>FanDuel</ToggleButton>
                            <ToggleButton value="BetMGM" sx={betMGMToggle}>BetMGM</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                </div>
                <div className="sportsbook-lines-table-container">
                    <div className="select-wrapper">
                    <FormControl variant="standard" sx={{ minWidth: 128 }}>
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
                    <div className="table-wrapper">
                        {
                            matchup.odds?.bookmakers !== undefined && (<BettingOddsTable params={getBettingOddsTableParams()}/>)
                        }

                    </div>
                    
                </div>
                <div className="optimal-odds-table">
                        {
                            matchup.odds?.bookmakers !== undefined && (<OptimalOddsTable params={{}}/>)
                        }
                </div>
            </div>
        </div>
    );
}

export default MatchupLinesAndStatsComponent;