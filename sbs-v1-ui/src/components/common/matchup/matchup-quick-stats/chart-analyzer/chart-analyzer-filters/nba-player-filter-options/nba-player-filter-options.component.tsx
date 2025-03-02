import MenuItem from "@mui/material/MenuItem";
import { NbaTeamGameStatsFilters } from "../../../../../../../models/component/nba-team-game-stats-filters";
import { Matchup } from "../../../../../../../models/matchup";
import { range } from "../../../../../../../utils/utils";
import { QuickStatsAggregation } from "../../../../../../../models/enums/quick-stats-aggregation";
import { ThemeProvider } from "@emotion/react";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Select, Checkbox } from "@mui/material";
import { GameLocationsFilter } from "../../../../../../../models/enums/game-locations-filter";
import { GameStatsOption } from "../../../../../../../models/enums/game-stats-option";
import { TeamOptionsFilter } from "../../../../../../../models/enums/team-options-filter";
import { formLabelSx, radioLabelSx, radioIconSx, darkTheme, selectSx, checkboxFormControlLabelSx } from "../../../../../../../models/form-styles/styles";
import { NbaPlayerGameStatsFilters } from "../../../../../../../models/component/nba-player-game-stats-filters";

const NbaPlayerFilterOptions: React.FC<{
    matchup: Matchup, 
    id: any, 
    nbaPlayerGameStatsFiltersObj: NbaPlayerGameStatsFilters, 
    handleNbaPlayerGameStatsFiltersUpdate: any
}> = ({matchup, id, nbaPlayerGameStatsFiltersObj, handleNbaPlayerGameStatsFiltersUpdate}) => {            
    /* event handlers ****************************************************************/
    const handleTeamSelectChange = (x: any, id: any) => {
        handleNbaPlayerGameStatsFiltersUpdate({
            id: id,
            valuePath: 'teamFilter',
            value: x.target.value
        });
    };

    const handleGameStatSelectChange = (x: any, id: any) => {
        handleNbaPlayerGameStatsFiltersUpdate({
            id: id,
            valuePath: 'gameStatsOption',
            value: x.target.value
        });
    };

    const handleAggregatorSelectChange = (x: any, id: any) => {
        handleNbaPlayerGameStatsFiltersUpdate({
            id: id,
            valuePath: 'aggregation',
            value: x.target.value
        });
    };

    const handleAggregatorSliceSelectChange = (x: any, id: any) => {
        handleNbaPlayerGameStatsFiltersUpdate({
            id: id,
            valuePath: 'aggregationSlice',
            value: x.target.value
        });
    };

    const handlePastNumGamesSelectChange = (x: any, id: any) => {
        handleNbaPlayerGameStatsFiltersUpdate({
            id: id,
            valuePath: 'numberOfGames',
            value: x.target.value
        });
    };
    
    // TODO implement this later
    const handleShowLineOfBestFitChange = (x: any, id: any) => {
        handleNbaPlayerGameStatsFiltersUpdate({
            id: id,
            valuePath: 'showLineOfBestFit',
            value: x.target.checked
        });
    };

    const handleGameLocationChange = (x: any, id: any) => {
        handleNbaPlayerGameStatsFiltersUpdate({
            id: id,
            valuePath: 'gameLocationFilter',
            value: x.target.value
        });
    };

    const handleShowStdDeviationLinesChange = (x: any, id: any) => {
        handleNbaPlayerGameStatsFiltersUpdate({
            id: id,
            valuePath: 'showStdDeviationLines',
            value: x.target.checked
        });
    }

    const handleShowMinMaxLinesChange = (x: any, id: any) => {
        handleNbaPlayerGameStatsFiltersUpdate({
            id: id,
            valuePath: 'showMinMaxLines',
            value: x.target.checked
        });
    };
    /********************************************************************************/
    
    /* option ***********************************************************************/
    const numOfGames = nbaTeamGameStatsFiltersObj.teamFilter === TeamOptionsFilter.Away ?
    Object.values(matchup.away.teamAggGameStats.gameStats).length :
    Object.values(matchup.home.teamAggGameStats.gameStats).length;

    const numOfGamesSelectOptions = range(1, numOfGames).map((o) => (
        <MenuItem value={o}>{o}</MenuItem>
    )).concat([<MenuItem value='all'>All</MenuItem>]);

    const aggregationOptions = Object.values(QuickStatsAggregation).map((agg: QuickStatsAggregation) => {
        return (
            <MenuItem value={agg}>
                {agg.toString()}
            </MenuItem>
        );
    });

    const aggregationSliceOptions = range(1, numOfGames).map((o) => (
        <MenuItem value={o}>{o}</MenuItem>
    )).concat([<MenuItem value='all'>All</MenuItem>]);

    const gameStatsOption = Object.values(GameStatsOption).map((gso: GameStatsOption) => {
        return (
            <MenuItem value={gso}>
                {gso.toString()}
            </MenuItem>
        );
    });
    /********************************************************************************/

    return (
        <FormControl>
            <div className='filter-options'>
                <div className='filter-option-wrapper'>
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Team</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={nbaTeamGameStatsFiltersObj.teamFilter}
                        onChange={(x) => handleTeamSelectChange(x, id)}
                    >
                        <FormControlLabel sx={radioLabelSx} value={TeamOptionsFilter.Away} control={<Radio sx={radioIconSx}/>} label={matchup.away.teamNickname}/>
                        <FormControlLabel sx={radioLabelSx} value={TeamOptionsFilter.Home} control={<Radio sx={radioIconSx}/>} label={matchup.home.teamNickname} /> 
                    </RadioGroup>
                </div>
                <div className="filter-option-wrapper">
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Game Location</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={nbaTeamGameStatsFiltersObj.gameLocationFilter}
                        onChange={(x) => handleGameLocationChange(x, id)}
                    >
                        <FormControlLabel sx={radioLabelSx} value={GameLocationsFilter.All} control={<Radio sx={radioIconSx}/>} label={GameLocationsFilter.All} />
                        <FormControlLabel sx={radioLabelSx} value={GameLocationsFilter.Away} control={<Radio sx={radioIconSx}/>} label={GameLocationsFilter.Away} />
                        <FormControlLabel sx={radioLabelSx} value={GameLocationsFilter.Home} control={<Radio sx={radioIconSx}/>} label={GameLocationsFilter.Home}/>
                    </RadioGroup>
                </div> 
                <div className='filter-option-wrapper'>
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Game Stat</FormLabel>
                    <div className="select-wrapper">
                        <ThemeProvider theme={darkTheme}>
                            <FormControl variant="standard" sx={{ width: '100%'}}>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={nbaTeamGameStatsFiltersObj.gameStatsOption}
                                    onChange={(x) => handleGameStatSelectChange(x, id)}
                                    sx={{...selectSx, fontSize: '.8rem'}}
                                >
                                    {gameStatsOption}
                                </Select>
                            </FormControl>
                        </ThemeProvider>
                    </div>
                </div>
                <div className='filter-option-wrapper'>
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Aggregator</FormLabel>
                    <div className="select-wrapper">
                        <ThemeProvider theme={darkTheme}>
                            <FormControl variant="standard" sx={{ width: '100%'}}>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={nbaTeamGameStatsFiltersObj.aggregation}
                                    onChange={(x) => handleAggregatorSelectChange(x, id)}
                                    sx={{...selectSx, fontSize: '.8rem'}}
                                >
                                    {aggregationOptions}
                                </Select>
                            </FormControl>
                        </ThemeProvider>
                    </div>
                </div>
                {
                    nbaTeamGameStatsFiltersObj.aggregation === QuickStatsAggregation.RollingAverage && (
                        <div className='filter-option-wrapper'>
                            <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Aggregation Slice</FormLabel>
                            <div className="select-wrapper">
                                <ThemeProvider theme={darkTheme}>
                                    <FormControl variant="standard" sx={{ width: '100%'}}>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={nbaTeamGameStatsFiltersObj.aggregationSlice}
                                            onChange={(x) => handleAggregatorSliceSelectChange(x, id)}
                                            sx={{...selectSx, fontSize: '.8rem'}}
                                        >
                                            {aggregationSliceOptions}
                                        </Select>
                                    </FormControl>
                                </ThemeProvider>
                            </div>
                        </div> 
                    )
                }
                <div className='filter-option-wrapper'>
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Past # of games</FormLabel>
                    <div className="select-wrapper">
                        <ThemeProvider theme={darkTheme}>
                            <FormControl variant="standard" sx={{ width: '100%'}}>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={nbaTeamGameStatsFiltersObj.numberOfGames === undefined ? 'all' : nbaTeamGameStatsFiltersObj.numberOfGames }
                                    onChange={(x) => handlePastNumGamesSelectChange(x, id)}
                                    sx={{...selectSx, fontSize: '.8rem'}}
                                >
                                    {numOfGamesSelectOptions}
                                </Select>
                            </FormControl>
                        </ThemeProvider>
                    </div>
                </div>
                {/* <div className='filter-option-wrapper'>
                    <FormControlLabel
                        label="Line of best fit"
                        sx={checkboxFormControlLabelSx}
                        control={<Checkbox checked={nbaTeamGameStatsFiltersObj.showLineOfBestFit} onChange={(x) => handleShowLineOfBestFitChange(x, id)} />}
                    />
                </div> */}
                <div className='filter-option-wrapper'>
                    <FormControlLabel
                        label="Std Dev"
                        sx={checkboxFormControlLabelSx}
                        control={<Checkbox checked={nbaTeamGameStatsFiltersObj.showStdDeviationLines} onChange={(x) => handleShowStdDeviationLinesChange(x, id)} />}
                    />
                </div>
                <div className='filter-option-wrapper'>
                    <FormControlLabel
                        label="Min Max"
                        sx={checkboxFormControlLabelSx}
                        control={<Checkbox checked={nbaTeamGameStatsFiltersObj.showMinMaxLines} onChange={(x) => handleShowMinMaxLinesChange(x, id)} />}
                    />
                </div>
            </div>
        </FormControl>
    );
};

export default NbaPlayerFilterOptions;