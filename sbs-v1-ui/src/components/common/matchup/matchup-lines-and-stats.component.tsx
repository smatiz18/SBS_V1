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
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React from "react";

const MatchupLinesAndStatsComponent: React.FC<{matchup: MatchupLinesAndStats}> = ({matchup}) => {
    const [bookmaker, setBookmaker] = useState(Bookmakers.DraftKings);
    const [betOption, setBetOption] = useState(BetOptions.Team);
    const [lineOptions, setLineOptions] = useState([{ label: 'Team Lines', value: 'TeamLines'}]);
    const [alignment, setAlignment] = useState('draftkings');

    const handleChange = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string,
    ) => {
      setAlignment(newAlignment);
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
            betOption: betOption 
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

    /* TODO: GO OVER STYLE */
    const toggleButtonSx = {
        textTransform: 'none',
        fontFamily: 'IBM Plex Sans, sans-serif',
        backgroundColor: 'rgba(26, 27, 65, 0.1725)', // Muted dark blue background with low opacity
        color: '$text-subtle', // Subtle text color for default state
        border: `1px solid ${'$gray-border'}`, // Light gray border for separation
        '&.Mui-selected': {
            backgroundColor: 'rgba(75, 0, 130, 0.4)', // Slightly opaque main purple when selected
            color: '#FFFFFF', // White text when selected for better contrast
        },
        '&:hover': {
            backgroundColor: 'rgba(46, 44, 92, 0.3)', // Dark purple for hover with increased opacity
            color: '$text-color'
        },
        '&.Mui-disabled': {
            backgroundColor: '$offwhite-background', // Off-white background for disabled state
            color: '$text-subtle', // Subtle text color for disabled state
        },
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
                            value={alignment}
                            exclusive
                            onChange={handleChange}
                            aria-label="Small sizes"
                        >
                            <ToggleButton value="draftkings" sx={toggleButtonSx}>Draftkings</ToggleButton>
                            <ToggleButton value="fanduel" sx={toggleButtonSx}>Fanduel</ToggleButton>
                            <ToggleButton value="betMGM" sx={toggleButtonSx}>BetMGM</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                </div>
                <div className="sportsbook-lines-table-container">
                    <div className="select-wrapper">
                    <FormControl variant="standard" sx={{ minWidth: 128 }}>
                        {/* <InputLabel id="demo-simple-select-standard-label">Age</InputLabel> */}
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={undefined}
                            onChange={() => {}}
                            label="Age"
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    </div>
                    <div className="table-wrapper">
                        {
                            // TODO optimize this
                            getBettingOddsCells().length > 1 && (<BettingOddsTable params={getBettingOddsTableParams()}/>)
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}

export default MatchupLinesAndStatsComponent;