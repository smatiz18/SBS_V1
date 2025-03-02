import { ThemeProvider } from '@mui/material/styles';
import QueryBuilder, { formatQuery } from 'react-querybuilder';
import { buttonStyleSx, darkTheme, deleteIconSx, formLabelSx, selectSx } from '../../../../../models/form-styles/styles';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, FormLabel, MenuItem } from '@mui/material';
import { GameStatsOption } from '../../../../../models/enums/game-stats-option';
import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { executeMongoQuery } from '../../../../../services/common/services';
import { ExecuteMongoQueryRequest } from '../../../../../models/services/execute-mongo-query-request';
import DeleteIcon from '@mui/icons-material/Delete';
import './query-builder.component.scss';

const SBSQueryBuilder: React.FC<{ id: string, deleteQueryBuilder: any }> = ({ id, deleteQueryBuilder }) => {
    /* consts ***********************************************************************/
    enum AvailableCollections {
        NbaTeamAggregatedGameStatsHistorical = 'Team Historical Stats',
        NbaPlayerAggregatedGameStatsHistorical = 'Player Historical Stats',
    };

    const enumToCollectionMap = new Map([
        [AvailableCollections.NbaTeamAggregatedGameStatsHistorical, 'nba_team_aggregated_game_stats_historical'],
        [AvailableCollections.NbaPlayerAggregatedGameStatsHistorical, 'nba_player_aggregated_game_stats_historical']
    ]);

    const collectionToAvailableFieldsMap: any = {};

    collectionToAvailableFieldsMap[AvailableCollections.NbaTeamAggregatedGameStatsHistorical] = [
        'season',
        'seasonType',
        'teamName',
        'teamNickname',
        'win',
        'isHome',
        ...Object.values(GameStatsOption).map((gso: any) => (
            gso.toString()
        )).filter((gso: any) => gso !== 'h1' && gso !== 'h2'),
    ];
    collectionToAvailableFieldsMap[AvailableCollections.NbaPlayerAggregatedGameStatsHistorical] = [
        'season',
        'seasonType',
        'teamName',
        'teamNickname',
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

    const playerStatsAggPipeline = [
        {
            $project: {
                playerStats: { $objectToArray: "$playerStats" },
                otherFields: "$$ROOT"
            }
        },
        { $unwind: "$playerStats" },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        "$otherFields",
                        "$playerStats.v"
                    ]
                }
            }
        },
        {
            $project: {
                playerStats: 0,
            }
        }
    ];

    const teamStatsAggPipeline = [
        {
            $project: {
                gameStats: { $objectToArray: "$gameStats" },
                otherFields: "$$ROOT"
            }
        },
        { $unwind: "$gameStats" },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        "$otherFields",
                        "$gameStats.v"
                    ]
                }
            }
        },
        {
            $project: {
                gameStats: 0,
            }
        }
    ];

    const collectionSelectOptions = Object.values(AvailableCollections).map((co) => (
        <MenuItem value={co}>
            {co}
        </MenuItem>
    ));

    const [currentCollection, setCurrentCollection] = useState(AvailableCollections.NbaTeamAggregatedGameStatsHistorical);
    const [queryBuilderFields, setQueryBuilderFields] = useState([] as any);
    const [query, setQuery] = useState(
        {
            combinator: 'and',
            rules: []
        }
    );
    const [numOfOccurrences, setNumOfOccurrences] = useState(0);
    /********************************************************************************/

    /* action funcs *****************************************************************/
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

        let prevPipelineStages: any[] = [];
        switch (currentCollection) {
            case AvailableCollections.NbaPlayerAggregatedGameStatsHistorical: {
                prevPipelineStages = playerStatsAggPipeline;
                break;
            }
            case AvailableCollections.NbaTeamAggregatedGameStatsHistorical: {
                prevPipelineStages = teamStatsAggPipeline;
                break;
            }
            default: break;
        };

        const aggPipeline = prevPipelineStages.concat([{ $match: JSON.parse(mongoQuery) }]);

        const stringifiedPipeline = aggPipeline.map((step) => JSON.stringify(step));

        executeMongoQuery(
            {
                aggregationPipeline: stringifiedPipeline,
                collectionName: `${enumToCollectionMap.get(currentCollection)}_collection`
            } as ExecuteMongoQueryRequest
        ).then((resp) => {
            setNumOfOccurrences(resp.data?.length || 0);
        });
    };

    function onDelete(id: string): void {
        deleteQueryBuilder(id);
    }
    /********************************************************************************/

    /* query parsers ****************************************************************/
    const parseQuery = (query: any) => {
        switch (currentCollection) {
            case AvailableCollections.NbaTeamAggregatedGameStatsHistorical: {
                return parseNbaTeamAggregatedGameStatsHistoricalQuery(query);
            }
            case AvailableCollections.NbaPlayerAggregatedGameStatsHistorical: {
                return parseNbaPlayerAggregatedGameStatsHistoricalQuery(query);
            }
            default: return query;
        };
    };

    const parseNbaTeamAggregatedGameStatsHistoricalQuery = (query: any) => {
        let numericalStats = new Set(
            [
                'season',
                'total',
                'q1',
                'q2',
                'q3',
                'q4'
            ]
        );

        const newRules = query.rules.map((rule: any) => {
            const ruleClone = cloneDeep(rule);
            if (numericalStats.has(rule.field)) {
                if (rule.field === 'total') {
                    ruleClone.field = 'points';
                } else if (rule.field === 'q1') {
                    ruleClone.field = 'linescore.0';
                } else if (rule.field === 'q2') {
                    ruleClone.field = 'linescore.1';
                } else if (rule.field === 'q3') {
                    ruleClone.field = 'linescore.2';
                } else if (rule.field === 'q4') {
                    ruleClone.field = 'linescore.3';
                }
                ruleClone.value = parseFloat(ruleClone.value);
            }
            return ruleClone;
        });

        return {
            ...query,
            rules: newRules
        };
    };

    const parseNbaPlayerAggregatedGameStatsHistoricalQuery = (query: any) => {
        let numericalStats = new Set(
            [
                'points',
                'season',
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
                'plusMinus'
            ]
        );

        const newRules = query.rules.map((rule: any) => {
            const ruleClone = cloneDeep(rule);
            if (numericalStats.has(rule.field)) {
                ruleClone.value = parseFloat(ruleClone.value);
            }
            return ruleClone;
        });

        return {
            ...query,
            rules: newRules
        };
    };
    /********************************************************************************/

    return (
        <div className='query-builder-container' id={id}>
            <div className='query-builder-options'>
                <div className='filter-option-wrapper'>
                    <ThemeProvider theme={darkTheme}>
                        <div className='header-wrapper'>
                            <FormLabel id='demo-row-radio-buttons-group-label' sx={formLabelSx}>Data Source</FormLabel>
                            <DeleteIcon sx={{ ...deleteIconSx, color: 'white' }} onClick={() => onDelete(id)} />
                        </div>
                        <div className='select-wrapper'>
                            <FormControl variant='standard' sx={{ width: '100%' }}>
                                <Select
                                    labelId='demo-simple-select-standard-label'
                                    id='demo-simple-select-standard'
                                    value={currentCollection}
                                    onChange={(x) => handleCollectionChange(x)}
                                    sx={{ ...selectSx, fontSize: '.8rem' }}
                                >
                                    {collectionSelectOptions}
                                </Select>
                            </FormControl>
                        </div>
                    </ThemeProvider>
                </div>
            </div>
            <div className='query-builder-wrapper'>
                <QueryBuilder
                    fields={queryBuilderFields}
                    query={query as any}
                    onQueryChange={setQuery as any}
                    controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
                />
            </div>
            <div className='apply-button-wrapper'>
                <ThemeProvider theme={darkTheme}>
                    <Button sx={buttonStyleSx} variant="outlined" size="small" onClick={onSearch}>Search</Button>
                </ThemeProvider>
            </div>
            <div className='result'>
                <div className='result-header'>
                    Occurrences: {<span className='bold-num'>{numOfOccurrences}</span>}
                </div>
            </div>
        </div>
    )
}

export default SBSQueryBuilder;