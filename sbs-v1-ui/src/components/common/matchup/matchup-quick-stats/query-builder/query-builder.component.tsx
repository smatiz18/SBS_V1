import { ThemeProvider } from '@mui/material/styles';
import QueryBuilder, { formatQuery } from 'react-querybuilder';
import { buttonStyleSx, darkTheme, formLabelSx, selectSx } from '../../../../../models/form-styles/styles';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, FormLabel, MenuItem } from '@mui/material';
import { GameStatsOption } from '../../../../../models/enums/game-stats-option';
import { useEffect, useState } from 'react';
import './query-builder.component.scss';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { executeMongoQuery } from '../../../../../services/common/services';
import { ExecuteMongoQueryRequest } from '../../../../../models/services/execute-mongo-query-request';

const SBSQueryBuilder: React.FC<{}> = () => {
    enum AvailableCollections {
        NbaGamePlayerStatsHistorical = 'nba_game_player_stats_historical',
        NbaGamesHistorical = 'nba_games_historical',
        NbaPlayerAggregatedGameStatsHistorical = 'nba_player_aggregated_game_stats_historical',
        NbaTeamAggregatedGameStatsHistorical = 'nba_team_aggregated_game_stats_historical',
        NbaTeamStats = 'nba_steam_stats'  
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
        const parsedQuery = parseQuery(query);
        const mongoQuery = formatQuery(parsedQuery, 'mongodb');
        const asMatchAggPipeline = [JSON.stringify({
            $match: JSON.parse(mongoQuery) 
        })];
        
        executeMongoQuery(
            {
                aggregationPipeline: asMatchAggPipeline,
                collectionName: `${currentCollection}_collection`
            } as ExecuteMongoQueryRequest
        ).then((resp) => {
            console.log(resp.data);
        });
    };

    const parseQuery = (query: any) => {
        switch (currentCollection) {
            case AvailableCollections.NbaGamesHistorical: {
                return parseNbaGamesHistoricalQuery(query)
            }
            default: return query;
        };
    };


    const getVisitorsAndHomeOrQuery = (
        isHome: boolean, 
        visitorsFieldName: string, 
        homeFieldName: string, 
        rule: any,
        isNum?: boolean, 
        not?: boolean
    ) => {
        if (isHome) {
            return {
                ...rule,
                field: homeFieldName,
                value: isNum ? parseFloat(rule.value) : rule.value
            };
        }
        return {
            combinator: 'or',
            not: !!not,
            id:  uuidv4(),
            rules: [
                {
                    ...rule,
                    field: visitorsFieldName,
                    id: uuidv4(),
                    value: isNum ? parseFloat(rule.value) : rule.value
                },
                {
                    ...rule,
                    field: homeFieldName,
                    id: uuidv4(),
                    value: isNum ? parseFloat(rule.value) : rule.value
                }
            ]
        };
    }

    const parseNbaGamesHistoricalQuery = (query: any) => {
        const isHomeFilter = !!query.rules.find((rule: any) => rule.field === 'isHome');
        
        const parsedRules = query.rules.map((rule: any) => {
            const ruleClone = cloneDeep(rule);
            switch (ruleClone.field) {
                case 'season': {
                    return {
                        ...ruleClone,
                        value: parseFloat(ruleClone.value)
                    };
                }
                case 'teamName': {
                    return getVisitorsAndHomeOrQuery(
                        isHomeFilter,
                        'teamsVisitorsName',
                        'teamsHomeName',
                        ruleClone
                    );
                }
                case 'teamNickname': {
                    return getVisitorsAndHomeOrQuery(
                        isHomeFilter,
                        'teamsVisitorsNickname',
                        'teamsHomeNickname',
                        ruleClone
                    );
                }
                case GameStatsOption.q1: {
                    return getVisitorsAndHomeOrQuery(
                        isHomeFilter,
                        'scoresVisitorsLinescore.0',
                        'scoresHomeLinescore.0',
                        true,
                        ruleClone
                    );
                }
                case GameStatsOption.q2: {
                    return getVisitorsAndHomeOrQuery(
                        isHomeFilter,
                        'scoresVisitorsLinescore.1',
                        'scoresHomeLinescore.1',
                        true,
                        ruleClone
                    );
                }
                // TODO: implement later
                // case GameStatsOption.h1: {
                // }
                case GameStatsOption.q3: {
                    return getVisitorsAndHomeOrQuery(
                        isHomeFilter,
                        'scoresVisitorsLinescore.2',
                        'scoresHomeLinescore.2',
                        true,
                        ruleClone
                    );
                }
                case GameStatsOption.q4: {
                    return getVisitorsAndHomeOrQuery(
                        isHomeFilter,
                        'scoresVisitorsLinescore.3',
                        'scoresHomeLinescore.3',
                        true,
                        ruleClone
                    );
                }
                // TODO: implement later
                // case GameStatsOption.h2: {
                // }
                case GameStatsOption.total: {
                    return getVisitorsAndHomeOrQuery(
                        isHomeFilter,
                        'scoresVisitorsPoints',
                        'scoresHomePoints',
                        true,
                        ruleClone
                    );
                }
            }
            return ruleClone;
        });
        return {
            ...query,
            rules: parsedRules
        };
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