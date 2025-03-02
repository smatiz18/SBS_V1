import MenuItem from "@mui/material/MenuItem";
import { Matchup } from "../../../../../../../models/matchup";
import { range } from "../../../../../../../utils/utils";
import { QuickStatsAggregation } from "../../../../../../../models/enums/quick-stats-aggregation";
import { ThemeProvider } from "@emotion/react";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Select, Checkbox } from "@mui/material";
import { GameLocationsFilter } from "../../../../../../../models/enums/game-locations-filter";
import { formLabelSx, radioLabelSx, radioIconSx, darkTheme, selectSx, checkboxFormControlLabelSx } from "../../../../../../../models/form-styles/styles";
import { NbaPlayerGameStatsFilters } from "../../../../../../../models/component/nba-player-game-stats-filters";
import { NbaPlayerStatsOption } from "../../../../../../../models/enums/nba-player-stats-option";
import { NbaTeamsMappedByNbaApiId } from "../../../../../../../constants/nba";
import { useEffect, useState } from "react";
import { getAllNbaPlayerStatsObjsFromAllTeams } from "../../../../../../../models/nba-player-agg-game-stats-historical";

const NbaPlayerFilterOptions: React.FC<{
    matchup: Matchup, 
    id: any, 
    nbaPlayerGameStatsFiltersObj: NbaPlayerGameStatsFilters, 
    handleNbaPlayerGameStatsFiltersUpdate: any,
    selectedPlayerName?: string
}> = ({matchup, id, nbaPlayerGameStatsFiltersObj, handleNbaPlayerGameStatsFiltersUpdate, selectedPlayerName}) => {   
    const [playerStatsObjects, setPlayerStatsObjects] = useState(getAllNbaPlayerStatsObjsFromAllTeams(matchup.playerAggGameStats, selectedPlayerName!));

    /* option getters ****************************************************************/

    const getNumOfGames = () => playerStatsObjects.length;

    const getTeamIdOptions = () => {        
        return [<MenuItem value='all'>All</MenuItem>].concat(
            Array.from(new Set(playerStatsObjects.map((pso) => pso.teamId!)).values())
                .map((teamId: number) => {
                    return (
                        <MenuItem value={teamId}>
                            {NbaTeamsMappedByNbaApiId[teamId].teamNickname}
                        </MenuItem>
                    );
                })
        );
    };

    const getNumOfGamesSelectOptions = () => range(1, getNumOfGames()).map((o) => (
        <MenuItem value={o}>{o}</MenuItem>
    )).concat([<MenuItem value='all'>All</MenuItem>]);

    const getAggregationOptions = () => Object.values(QuickStatsAggregation).map((agg: QuickStatsAggregation) => {
        return (
            <MenuItem value={agg}>
                {agg.toString()}
            </MenuItem>
        );
    });

    const getAggregationSliceOptions = () => range(1, getNumOfGames()).map((o) => (
        <MenuItem value={o}>{o}</MenuItem>
    )).concat([<MenuItem value='all'>All</MenuItem>]);

    const getPlayerStatsOption = () => Object.values(NbaPlayerStatsOption).map((pso: NbaPlayerStatsOption) => {
        return (
            <MenuItem value={pso}>
                {pso.toString()}
            </MenuItem>
        );
    });
    /*********************************************************************************/     

    /* consts ************************************************************************/
    const [teamIdOptions, setTeamIdOptions] = useState(getTeamIdOptions());
    const [numOfGamesSelectOptions, setNumOfGamesSelectOptions] = useState(getNumOfGamesSelectOptions());
    const [aggregationOptions, setAggregationOptions] = useState(getAggregationOptions());
    const [aggregationSliceOptions, setAggregationSliceOptions] = useState(getAggregationSliceOptions());
    const [playerStatsOption, setPlayerStatsOption] = useState(getPlayerStatsOption());
    /*********************************************************************************/
    
    /* effects ***********************************************************************/
    useEffect(() => {
        setPlayerStatsObjects(getAllNbaPlayerStatsObjsFromAllTeams(matchup.playerAggGameStats, selectedPlayerName!));
    }, [selectedPlayerName]);

    useEffect(() => {
        setTeamIdOptions(getTeamIdOptions());
        setNumOfGamesSelectOptions(getNumOfGamesSelectOptions());
        setAggregationOptions(getAggregationOptions());
        setAggregationSliceOptions(getAggregationSliceOptions());
        setPlayerStatsOption(getPlayerStatsOption());
    }, [playerStatsObjects]);
    /*********************************************************************************/    
    
    /* event handlers ****************************************************************/
    const handleTeamSelectChange = (x: any, id: any) => {
        handleNbaPlayerGameStatsFiltersUpdate({
            id: id,
            valuePath: 'teamIdFilter',
            value: x.target.value === 'all' ? undefined : x.target.value
        });
    };

    const handlePlayerStatSelectChange = (x: any, id: any) => {
        handleNbaPlayerGameStatsFiltersUpdate({
            id: id,
            valuePath: 'playerStatsOption',
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

    return (
        <FormControl>
            <div className='filter-options'>
            <div className='filter-option-wrapper'>
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Team</FormLabel>
                    <div className="select-wrapper">
                        <ThemeProvider theme={darkTheme}>
                            <FormControl variant="standard" sx={{ width: '100%'}}>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={nbaPlayerGameStatsFiltersObj.teamIdFilter === undefined ? 'all' : nbaPlayerGameStatsFiltersObj.teamIdFilter}
                                    onChange={(x) => handleTeamSelectChange(x, id)}
                                    sx={{...selectSx, fontSize: '.8rem'}}
                                >
                                    {teamIdOptions}
                                </Select>
                            </FormControl>
                        </ThemeProvider>
                    </div>
                </div>
                <div className="filter-option-wrapper">
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Game Location</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={nbaPlayerGameStatsFiltersObj.gameLocationFilter}
                        onChange={(x) => handleGameLocationChange(x, id)}
                    >
                        <FormControlLabel sx={radioLabelSx} value={GameLocationsFilter.All} control={<Radio sx={radioIconSx}/>} label={GameLocationsFilter.All} />
                        <FormControlLabel sx={radioLabelSx} value={GameLocationsFilter.Away} control={<Radio sx={radioIconSx}/>} label={GameLocationsFilter.Away} />
                        <FormControlLabel sx={radioLabelSx} value={GameLocationsFilter.Home} control={<Radio sx={radioIconSx}/>} label={GameLocationsFilter.Home}/>
                    </RadioGroup>
                </div> 
                <div className='filter-option-wrapper'>
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Player Stat</FormLabel>
                    <div className="select-wrapper">
                        <ThemeProvider theme={darkTheme}>
                            <FormControl variant="standard" sx={{ width: '100%'}}>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={nbaPlayerGameStatsFiltersObj.playerStatsOption}
                                    onChange={(x) => handlePlayerStatSelectChange(x, id)}
                                    sx={{...selectSx, fontSize: '.8rem'}}
                                >
                                    {playerStatsOption}
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
                                    value={nbaPlayerGameStatsFiltersObj.aggregation}
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
                    nbaPlayerGameStatsFiltersObj.aggregation === QuickStatsAggregation.RollingAverage && (
                        <div className='filter-option-wrapper'>
                            <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Aggregation Slice</FormLabel>
                            <div className="select-wrapper">
                                <ThemeProvider theme={darkTheme}>
                                    <FormControl variant="standard" sx={{ width: '100%'}}>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={nbaPlayerGameStatsFiltersObj.aggregationSlice}
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
                                    value={nbaPlayerGameStatsFiltersObj.numberOfGames === undefined ? 'all' : nbaPlayerGameStatsFiltersObj.numberOfGames }
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
                        control={<Checkbox checked={nbaPlayerGameStatsFiltersObj.showLineOfBestFit} onChange={(x) => handleShowLineOfBestFitChange(x, id)} />}
                    />
                </div> */}
                <div className='filter-option-wrapper'>
                    <FormControlLabel
                        label="Std Dev"
                        sx={checkboxFormControlLabelSx}
                        control={<Checkbox checked={nbaPlayerGameStatsFiltersObj.showStdDeviationLines} onChange={(x) => handleShowStdDeviationLinesChange(x, id)} />}
                    />
                </div>
                <div className='filter-option-wrapper'>
                    <FormControlLabel
                        label="Min Max"
                        sx={checkboxFormControlLabelSx}
                        control={<Checkbox checked={nbaPlayerGameStatsFiltersObj.showMinMaxLines} onChange={(x) => handleShowMinMaxLinesChange(x, id)} />}
                    />
                </div>
            </div>
        </FormControl>
    );
};

export default NbaPlayerFilterOptions;