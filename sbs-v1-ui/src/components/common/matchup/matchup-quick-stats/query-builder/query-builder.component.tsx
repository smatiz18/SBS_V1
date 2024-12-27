import { ThemeProvider } from '@mui/material/styles';
import QueryBuilder from 'react-querybuilder';
import { buttonStyleSx, darkTheme, formLabelSx, selectSx } from '../../../../../models/form-styles/styles';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, FormLabel, MenuItem } from '@mui/material';
import { GameStatsOption } from '../../../../../models/enums/game-stats-option';
import { useEffect, useState } from 'react';
import './query-builder.component.scss';

const SBSQueryBuilder: React.FC<{}> = () => {
    enum AvailableCollections {
        NbaGamePlayerStatsHistorical = 'NbaGamePlayerStatsHistorical',
        NbaGamesHistorical = 'NbaGamesHistorical',
        NbaPlayerAggregatedGameStatsHistorical = 'NbaPlayerAggregatedGameStatsHistorical',
        NbaTeamAggregatedGameStatsHistorical = 'NbaTeamAggregatedGameStatsHistorical',
        NbaTeamStats = 'NbaTeamStats'  
    };
    const collectionToAvailableFieldsMap: any = {};
    collectionToAvailableFieldsMap[AvailableCollections.NbaGamePlayerStatsHistorical] = [
        'season',
        'dateStart',
        'isHome',
        'firstname',
        'lastname',
        'points',
        'min',
        'fgm',
        'fga',
        'fgp',
        'ftm',
        'fta',
        'ftp',
        'tpm',
        'tpa',
        'tpp',
        'offReb',
        'defReb',
        'totReb',
        'assists',
        'pFouls',
        'steals',
        'turnovers',
        'blocks',
        'plusMinus',
        'dateStart',
        'win',
        'isHome'
    ];
    collectionToAvailableFieldsMap[AvailableCollections.NbaGamesHistorical] = [
        'season',
        'dateStart',
        'teamName',
        'teamNickname',
        'isHome',
        ...Object.values(GameStatsOption).map((gso: any) => (
            gso.toString()
        )),
    ];    
    collectionToAvailableFieldsMap[AvailableCollections.NbaPlayerAggregatedGameStatsHistorical] = [
        'playerId',
        'teamId',
        'seasonType',
        'firstname',
        'lastname',
        'birthday',
        'countryOfBirth',
        'points',
        'min',
        'fgm',
        'fga',
        'fgp',
        'ftm',
        'fta',
        'ftp',
        'tpm',
        'tpa',
        'tpp',
        'offReb',
        'defReb',
        'totReb',
        'assists',
        'pFouls',
        'steals',
        'turnovers',
        'blocks',
        'plusMinus',
        'dateStart',
        'win',
        'isHome'
    ];
    collectionToAvailableFieldsMap[AvailableCollections.NbaTeamAggregatedGameStatsHistorical] = [
        'season',
        'seasonType',
        'teamName',
        'teamNickname',
        'isHome',
        ...Object.values(GameStatsOption).map((gso: any) => (
            gso.toString()
        )),
        'win',
        'dateStart'
    ];
    collectionToAvailableFieldsMap[AvailableCollections.NbaTeamStats] = [
        'awayLosses',
        'awayStreak',
        'awayWins',
        'homeLosses',
        'homeStreak',
        'homeWins',
        'lastGameId',
        'lastTenAwayLosses',
        'lastTenAwayWins',
        'lastTenHomeLosses',
        'lastTenHomeWins',
        'lastTenTotalLosses',
        'lastTenTotalWins',
        'season',
        'seasonType',
        'totalLosses',
        'totalStreak',
        'totalWins',
        'teamName',
        'teamNickname'
    ];
   
    const collectionSelectOptions = Object.values(AvailableCollections).map((co) => (
        <MenuItem value={co}>
            {co}
        </MenuItem>
    ));

    const [currentCollection, setCurrentCollection] = useState(AvailableCollections.NbaGamesHistorical);
    const [queryBuilderFields, setQueryBuilderFields] = useState([] as any);
    const [query, setQuery] = useState(  
        {
            combinator: 'and',
            rules: []
        }
    );
    useEffect(() => {
        updateQueryBuilderOptions(currentCollection);
    }, [currentCollection]);       

    const updateQueryBuilderOptions = (collection: AvailableCollections) => {
        setQueryBuilderFields(collectionToAvailableFieldsMap[collection]
            .map((f: any) => ({ name: f, label: f })));
    };
    
    const handleCollectionChange = (x: any) => {
        setCurrentCollection(x.target.value);
    };

    const onSearch = () => {
        parseQuery(query);
    };

    const parseQuery = (query: any) => {
        console.log(query);
        switch (currentCollection) {
            case AvailableCollections.NbaGamesHistorical: {

            };
        };
    };


    const parseNbaGamesHistoricalQuery = (query: any) => {
        // field: 
        // "total"
        // id
        // : 
        // "91051d12-2d85-4712-905a-cb81ef6164ec"
        // operator
        // : 
        // ">="
        // value
        // : 
        // "135"
        // valueSource
        // : 
        // "value"

        const newRules = query.rules.map((rule: any) => {
            if (rule.field === 'total') {

            } 
        });
    };

    return (
        <div className='query-builder-container'>
            <div className='query-builder-options'>
                <div className='filter-option-wrapper'>
                     <ThemeProvider theme={darkTheme}>
                        <FormLabel id='demo-row-radio-buttons-group-label' sx={formLabelSx}>Data Source</FormLabel>
                        <div className='select-wrapper'>
                            <FormControl variant='standard' sx={{ width: '100%'}}>
                                <Select
                                    labelId='demo-simple-select-standard-label'
                                    id='demo-simple-select-standard'
                                    value={AvailableCollections.NbaGamesHistorical}
                                    onChange={(x) => handleCollectionChange(x)}
                                    sx={{...selectSx, fontSize: '.8rem'}}
                                >
                                    {collectionSelectOptions}
                                </Select>
                            </FormControl>
                        </div>
                    </ThemeProvider>
                </div>
            </div>
            <div className='query-builder-wrapper'>
                <QueryBuilder fields={queryBuilderFields} query={query as any} onQueryChange={setQuery as any}/>
            </div>
            <div className='apply-button-wrapper'>
                <ThemeProvider theme={darkTheme}>
                    <Button sx={buttonStyleSx} variant="outlined" size="small" onClick={onSearch}>Search</Button>
                </ThemeProvider>
            </div>
        </div>
    )
}

export default SBSQueryBuilder;