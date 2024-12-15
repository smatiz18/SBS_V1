import { ThemeProvider } from "@mui/material/styles";
import { accordianSummarySx, checkboxFormControlLabelSx, darkTheme, filterAccordianSx, formLabelSx, radioIconSx, radioLabelSx, selectSx, subFilterAccordianSx } from "../../../../../../models/form-styles/styles";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TeamOptionsFilter } from "../../../../../../models/enums/team-options-filter";
import { GameLocationsFilter } from "../../../../../../models/enums/game-locations-filter";
import { GameStatsOption } from "../../../../../../models/enums/game-stats-option";
import { QuickStatsAggregation } from "../../../../../../models/enums/quick-stats-aggregation";
import { GameStatsFilters, NbaTeamFilters } from "../../../../../../models/component/nba-team-filters";
import { useState } from "react";
import { BetOptions } from "../../../../../../models/enums/bet-options";
import { Matchup, TeamInfo } from "../../../../../../models/matchup";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select/Select";
import Checkbox from "@mui/material/Checkbox";
import './chart-analyzer-filters.component.scss';
import MenuItem from "@mui/material/MenuItem";
import { range } from "../../../../../../utils/utils";
import Button from "@mui/material/Button";

const ChartAnalyzerFilters: React.FC<{betOption: BetOptions, matchup: Matchup, handleFilterChange: any}> = 
    ({betOption, matchup, handleFilterChange}) => {
    
        const [nbaTeamFilters, setNbaTeamFilters] = useState({ 
        teamFilter: TeamOptionsFilter.Away,
        gameLocationFilter: GameLocationsFilter.All,
        gameStatsLineComparator: {
            gameStatsOption: GameStatsOption.total,
            aggregation: QuickStatsAggregation.Actual,
            lineOfBestFit: true
        } as GameStatsFilters,
        additionalGameStatsLines: [],
    } as NbaTeamFilters);

    const getTeamFilterOptionsHelper = (teamInfo: TeamInfo, isComparator: boolean) => {
        const numOfGamesSelectOptions = range(1, Object.values(teamInfo.teamStats).length).map((o) => (
            <MenuItem value={o}>{o}</MenuItem>
        )).concat([<MenuItem value='all'>All</MenuItem>]);

        const aggregationOptions = Object.values(QuickStatsAggregation).map((agg: QuickStatsAggregation) => {
            return (
                <MenuItem value={agg}>
                    {agg.toString()}
                </MenuItem>
            );
        });

        return (
            <FormControl>
                <div className='filter-options'>
                    <div className='filter-option-wrapper'>
                        <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Team</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={teamInfo.teamNickname}
                            onChange={() => {}}
                        >
                            <FormControlLabel sx={radioLabelSx} value={matchup.away.teamNickname} control={<Radio sx={radioIconSx}/>} label={matchup.away.teamNickname}/>
                            <FormControlLabel sx={radioLabelSx} value={matchup.home.teamNickname} control={<Radio sx={radioIconSx}/>} label={matchup.home.teamNickname} /> 
                        </RadioGroup>
                    </div>
                    <div className="filter-option-wrapper">
                        <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Game Location</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={GameLocationsFilter.All}
                            onChange={() => {}}
                        >
                            <FormControlLabel sx={radioLabelSx} value={GameLocationsFilter.All} control={<Radio sx={radioIconSx}/>} label={GameLocationsFilter.All} />
                            <FormControlLabel sx={radioLabelSx} value={GameLocationsFilter.Away} control={<Radio sx={radioIconSx}/>} label={GameLocationsFilter.Away} />
                            <FormControlLabel sx={radioLabelSx} value={GameLocationsFilter.Home} control={<Radio sx={radioIconSx}/>} label={GameLocationsFilter.Home}/>
                        </RadioGroup>
                    </div> 
                    <div className='filter-option-wrapper'>
                        <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Aggregator</FormLabel>
                        <div className="select-wrapper">
                            <ThemeProvider theme={darkTheme}>
                                <FormControl variant="standard" sx={{ width: '100%'}}>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={QuickStatsAggregation.Actual}
                                        onChange={(val: any) => {}}
                                        sx={{...selectSx, fontSize: '.8rem'}}
                                    >
                                        {aggregationOptions}
                                    </Select>
                                </FormControl>
                            </ThemeProvider>
                        </div>
                    </div>
                    <div className='filter-option-wrapper'>
                        <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Past # of games</FormLabel>
                        <div className="select-wrapper">
                            <ThemeProvider theme={darkTheme}>
                                <FormControl variant="standard" sx={{ width: '100%'}}>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={'all'}
                                        onChange={(val: any) => {}}
                                        sx={{...selectSx, fontSize: '.8rem'}}
                                    >
                                        {numOfGamesSelectOptions}
                                    </Select>
                                </FormControl>
                            </ThemeProvider>
                        </div>
                    </div>
                    <div className='filter-option-wrapper'>
                        <FormControlLabel
                            label="Line of best fit"
                            sx={checkboxFormControlLabelSx}
                            control={<Checkbox checked={false} onChange={() => {}} />}
                        />
                    </div>
                </div>
            </FormControl>
        );
    };

    const getTeamFilterOptions = (teamInfo: TeamInfo) => {
        return (
            <div className="team-filters">
                <Accordion sx={subFilterAccordianSx}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={accordianSummarySx}
                    >
                        Comparator
                    </AccordionSummary>
                    <AccordionDetails>
                        {getTeamFilterOptionsHelper(teamInfo, true)}
                    </AccordionDetails>
                </Accordion>
            </div>
        );
    };

    const getAccordianDetails = () => {
        if (betOption === BetOptions.Team) {
            return (
                <div className="accordian-details-wrapper">
                    {getTeamFilterOptions(matchup.away)}
                </div>
            )
        }
    }
    
    return (
        <div className="chart-analyzer-filters-container">
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
                    <AccordionDetails>
                        <Button variant="outlined" size="small">+</Button>
                    </AccordionDetails>
                </Accordion>
            </ThemeProvider>
        </div>
    );
}

export default ChartAnalyzerFilters;