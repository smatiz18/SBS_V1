import { useState } from "react";
import { BetOptions } from "../../../../../models/enums/bet-options";
import { Matchup, TeamInfo } from "../../../../../models/matchup";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { accordianSummarySx, darkTheme, filterAccordianSx, formLabelSx, radioIconSx, radioLabelSx } from "../../../../../models/form-styles/styles";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

import './filters.component.scss';

const Filters: React.FC<{betOption: BetOptions, matchup: Matchup}> = ({betOption, matchup}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getTeamFilterOptions = (teamInfo: TeamInfo) => {
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
                                value={'All'}
                                onChange={() => {}}
                            >
                                <FormControlLabel sx={radioLabelSx} value="Away" control={<Radio sx={radioIconSx}/>} label="Away" />
                                <FormControlLabel sx={radioLabelSx} value="Home" control={<Radio sx={radioIconSx}/>} label="Home" />
                                <FormControlLabel sx={radioLabelSx} value="All" control={<Radio sx={radioIconSx}/>} label="All" />
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

            </div>
        );
    }

    return (
        <div className="filters-container">
            <ThemeProvider theme={darkTheme}>
                <Accordion sx={filterAccordianSx}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={accordianSummarySx}
                    >
                        Filters
                    </AccordionSummary>
                    <AccordionDetails>
                        {getAccordianDetails()}
                    </AccordionDetails>
                </Accordion>
            </ThemeProvider>
        </div>
    );
}

export default Filters;