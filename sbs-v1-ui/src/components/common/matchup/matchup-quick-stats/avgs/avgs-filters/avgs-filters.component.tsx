import { useState } from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { GameLocationsFilter } from "../../../../../../models/enums/game-locations-filter";
import { BetOptions } from "../../../../../../models/enums/bet-options";
import { formLabelSx, radioLabelSx, radioIconSx, darkTheme, filterAccordianSx, accordianSummarySx } from "../../../../../../models/form-styles/styles";
import { Matchup, TeamInfo } from "../../../../../../models/matchup";
import './avgs-filters.component.scss';

const AvgsFilters: React.FC<{
    betOption: BetOptions, 
    matchup: Matchup, 
    handleFilterChange: any,
    selectedPlayerName?: string}> = ({betOption, matchup, handleFilterChange, selectedPlayerName}) => {
    
    /* consts ***********************************************************************/
    const [teamFilters, setTeamFilters] = useState({ 
        awayTeamGameLocations /* away team */: GameLocationsFilter.All,
        homeTeamGameLocations /* home team */: GameLocationsFilter.All
    });
    const [playerFilters, setPlayerFilters] = useState({ 
        gameLocations: GameLocationsFilter.All
    });
    /********************************************************************************/

    /* event handlers ***************************************************************/
    const onTeamFilterChange = (params: any) => {
        const isHome = params.target.value.split('_')[0] === matchup.home.teamNickname;
        const filter = params.target.value.split('_')[1] as GameLocationsFilter;

        const update = isHome ? { homeTeamGameLocations: filter } : { awayTeamGameLocations: filter };
        setTeamFilters(
            {
                ...teamFilters,
                ...update
            }
        );
        handleFilterChange(update);
    }

    const onPlayerFilterChange = (params: any) => {
        const filter = params.target.value.split('_')[1] as GameLocationsFilter;

        const update = { gameLocations: filter };
        setPlayerFilters(
            {
                ...playerFilters,
                ...update
            }
        );
        handleFilterChange(update);
    }
    /*******************************************************************************/

    /* getters *********************************************************************/
    const getTeamFilterOptions = (teamInfo: TeamInfo) => {
        const isHome = teamInfo.teamNickname === matchup.home.teamNickname;
        const filter = isHome ? teamFilters.homeTeamGameLocations : teamFilters.awayTeamGameLocations;
        return (
            <div className="team-filters">
                <div className='team-filters-header-container'>
                    <div className='team-filters-header'>
                        {teamInfo.teamNickname}
                    </div>
                </div>
                <div className='filter-options'>
                    <div className='game-filters'>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Game Location</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={`${teamInfo.teamNickname}_${filter}`}
                                onChange={onTeamFilterChange}
                            >
                                <FormControlLabel sx={radioLabelSx} value={`${teamInfo.teamNickname}_All`} control={<Radio sx={radioIconSx}/>} label="All" />
                                <FormControlLabel sx={radioLabelSx} value={`${teamInfo.teamNickname}_Away`} control={<Radio sx={radioIconSx}/>} label="Away" />
                                <FormControlLabel sx={radioLabelSx} value={`${teamInfo.teamNickname}_Home`} control={<Radio sx={radioIconSx}/>} label="Home" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
            </div>
        );
    }

    const getPlayerFilterOptions = () => {
        return (
            <div className="player-filters">
                <div className='player-filters-header-container'>
                    <div className='player-filters-header'>
                        {selectedPlayerName}
                    </div>
                </div>
                <div className='filter-options'>
                    <div className='game-filters'>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Game Location</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={`${selectedPlayerName}_${playerFilters.gameLocations}`}
                                onChange={onPlayerFilterChange}
                            >
                                <FormControlLabel sx={radioLabelSx} value={`${selectedPlayerName}_All`} control={<Radio sx={radioIconSx}/>} label="All" />
                                <FormControlLabel sx={radioLabelSx} value={`${selectedPlayerName}_Away`} control={<Radio sx={radioIconSx}/>} label="Away" />
                                <FormControlLabel sx={radioLabelSx} value={`${selectedPlayerName}_Home`} control={<Radio sx={radioIconSx}/>} label="Home" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
            </div>
        );
    }

    const getAccordianDetails = () => {
        if (betOption === BetOptions.Team) {
            return (
                <div className="accordian-details-wrapper">
                    {getTeamFilterOptions(matchup.away)}
                    {getTeamFilterOptions(matchup.home)}
                </div>
            );
        }
        return (
            <div className="player-filters">
                {getPlayerFilterOptions()}
            </div>
        );
    }
    /*******************************************************************************/
    
    const getFiltersSummary = () => {
        if (betOption === BetOptions.Team) {
            return `Filters: (${matchup.away.teamNickname}: ${teamFilters.awayTeamGameLocations} games, ${matchup.home.teamNickname}: ${teamFilters.homeTeamGameLocations} games)`;
        }
        return `Filters: (${selectedPlayerName}: ${playerFilters.gameLocations} games)`; 
    }
    return (
        <div className="avgs-filters-container">
            <ThemeProvider theme={darkTheme}>
                <Accordion sx={filterAccordianSx}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={accordianSummarySx}
                    >
                    {getFiltersSummary()}
                    </AccordionSummary>
                    <AccordionDetails>
                        {getAccordianDetails()}
                    </AccordionDetails>
                </Accordion>
            </ThemeProvider>
        </div>
    );
}

export default AvgsFilters;