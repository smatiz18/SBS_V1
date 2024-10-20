import Select from 'react-select';
import './backtest-parameters-form.scss';
import { reactSelectStyles } from '../../../../models/form-styles/styles';
import { SportsCategories } from '../../../../models/sports-categories';
import { useState } from 'react';
import { StakingStrategies } from '../../../../models/staking-strategies';
import { OddsSources } from '../../../../models/odds-sources';
import { TeamBetTypes } from '../../../../models/team-bet-types';
import { PlayerBetTypes } from '../../../../models/player-bet-types';
import { NbaTeams } from '../../../../constants/nba';
import { getNbaGamesByTeamAndSeason, getNbaOddsByTeamAndSeason, getNbaPlayerStatsByIdAndSeason, getNbaPlayersByTeamAndSeason } from '../../../../services/nba/services';
import { Market, NbaOddsHistorical } from '../../../../models/nba-odds-historical';
import { GetNbaPlayersByTeamAndSeasonResponse, Player } from '../../../../models/services/get-nba-players-by-team-and-season-response';
import { AxiosResponse } from 'axios';

// TODO add player options

const BacktestParametersForm = () => {
    const [sportsCategory, setSportsCategory] = useState(null as unknown as SportsCategories);
    const [season, setSeason] = useState(null);
    const [betType, setBetType] = useState(null as unknown as TeamBetTypes | PlayerBetTypes);
    const [stakingStrategy, setStakingStrategy] = useState(null); 
    const [oddsSource, setOddsSource] = useState(null);
    const [isPlayerBetType, setIsPlayerBetType] = useState(false);
    const [teamOptions, setTeamOptions] = useState([] as any);
    const [playerOptions, setPlayerOptions] = useState([] as any);
    const [team, setTeam] = useState(null);
    const [player, setPlayer] = useState(null as unknown as {
        value: number; label: string; 
    });
    const [historicalGameData, setHistoricalGameData] = useState([] as any);
    const [historicalOddsData, setHistoricalOddsData] = useState([] as any);
    const [historicalPlayersStatsAvgsData, setHistoricalPlayersStatsAvgsData] = useState([] as any);
    
    /* select options ***************************************************************/
    /********************************************************************************/
    const sportsCategoriesOptions: any[] = Object.values(SportsCategories).map((v) => {
        return { value: v, label: v };
    });
    
    const seasonOptions: any[] = [
        { value: 2023, label: 2023 }
    ];
    
    const betTypeOptions: any[] = [
        {
            label: 'Team',
            options: Object.values(TeamBetTypes).map((v) => {
                return { value: v, label: v };
            }),
        },
        {
            label: 'Player',
            options: Object.values(PlayerBetTypes).map((v) => {
                return { value: v, label: v }; 
            })
        },
    ];
    
    const stakingStrategyOptions: any[] = Object.values(StakingStrategies).map((v) => {
        return { value: v, label: v };
    });
    
    const oddsSourceOptions: any[] = Object.values(OddsSources).map((v) => {
        return { value: v, label: v };
    });
    
    const loadTeamOptions = (_season: any, sport: SportsCategories) => {
        switch(sport) {
            case SportsCategories.NBA: {
                const options = NbaTeams.map(x => { 
                    return { value: x.teamNickname, label: x.teamNickname }
                });
                setTeamOptions(options);
                break;
            }
            default: setTeamOptions([] as any); break;

        }
    };

    const loadPlayerOptions = (season: any, sport: SportsCategories) => {
        switch(sport) {
            case SportsCategories.NBA: {
                const teamId = NbaTeams.find((currTeam: any) => currTeam.teamNickname === team)!.nbaApiId!;
                getNbaPlayersByTeamAndSeason({ teamId: teamId, season: season })
                    .then((response: AxiosResponse<GetNbaPlayersByTeamAndSeasonResponse>) => {
                        setPlayerOptions(
                            (response.data?.response || []).map((player: Player) => ({
                                label: `${player.firstname} ${player.lastname}`,
                                value: player.id
                            }))
                        );
                    })
                    .catch((error: any) => {
                        console.error("Error fetching NBA players: ", error);
                        setPlayerOptions([] as any);
                    });
                break;
            }
            default: setPlayerOptions([] as any); break;
        }
    }
    /********************************************************************************/

    /* on selection functions *******************************************************/
    /********************************************************************************/
    const onSportsCategorySelection = (sportsCategory: SportsCategories) => {
        setSportsCategory(sportsCategory);
        loadTeamOptions(season, sportsCategory);
    }

    const onSeasonSelection = (season: any) => {
        setSeason(season);
        loadTeamOptions(season, sportsCategory);
    }

    const onBetTypeSelection = (betType: TeamBetTypes | PlayerBetTypes) => {
        setBetType(betType);
        if (new Set(Object.values(TeamBetTypes)).has(betType as TeamBetTypes)) {
            setIsPlayerBetType(false);
        } else {
            setIsPlayerBetType(true);
            loadPlayerOptions(season, sportsCategory);
        }
    }
    /********************************************************************************/


    /* data aggregation functions ***************************************************/
    /********************************************************************************/
    const parseOddsData = (
        historicalOddsData: any,
        betType: TeamBetTypes | PlayerBetTypes,
        oddsSource: OddsSources
    ) => {
        let filteredOddsData; 
        if (sportsCategory === SportsCategories.NBA) {
            filteredOddsData = (historicalOddsData as NbaOddsHistorical[]).reduce(
                (oddsArr, currObj: NbaOddsHistorical) => {
                    const oddsForOddsSource = currObj.bookmakerOdds
                        .find((obj) => obj.title === oddsSource);
                    const oddsObj = oddsForOddsSource?.markets
                        .find(obj => obj.key === betType)

                    if (oddsObj) {
                        oddsArr.push(oddsObj);
                    }
                    return oddsArr;
                },
                [] as Market[]
            );
        }
        return filteredOddsData;
    }

    const aggregateData = async () => {
        let featureMap;
        switch(sportsCategory) {
            case (SportsCategories.NBA): {
                const teamName = NbaTeams.find((teamObj: any) => teamObj.teamNickname === team )?.teamName;
                const teamId = NbaTeams.find((teamObj: any) => teamObj.teamNickname === team)?.nbaApiId;
                const gamesP = getNbaGamesByTeamAndSeason({ season: season!, teamId: teamId! });
                const oddsP = getNbaOddsByTeamAndSeason({ season: season!, teamName: encodeURIComponent(teamName!) })
                const playerStatsAvgsDataP = getNbaPlayerStatsByIdAndSeason({ playerId: player.value, season: season! }); 
                
                await Promise.all([gamesP, oddsP, playerStatsAvgsDataP])
                    .then(([gamesResp, oddsResp, playerStatsAvgsResp]) => {
                        setHistoricalGameData(gamesResp.data);
                        setHistoricalOddsData(oddsResp.data);
                        setHistoricalPlayersStatsAvgsData(playerStatsAvgsResp.data);
                        featureMap = getFeatureMap(gamesResp.data, oddsResp.data, betType, oddsSource!, playerStatsAvgsResp.data);
                    })
                    .catch((error: any) => {
                        console.error("Error fetching NBA games and odds data:", error);
                        setHistoricalGameData([]);
                        setHistoricalOddsData([]);
                        setHistoricalPlayersStatsAvgsData([]);
                    });
                break;
            }
            default: break;
        }
        return featureMap;
    }

    const getFeatureMap = (
        historicalGameData: any, 
        historicalOddsData: any, 
        betType: TeamBetTypes | PlayerBetTypes,
        oddsSource: OddsSources,
        playerStatsAvgsData?: any
    ) => {
        const filteredOddsData = parseOddsData(historicalOddsData, betType, oddsSource);
        console.log("Odds Data.");
        console.log(filteredOddsData);

        console.log("Games Data.");
        console.log(historicalGameData);   

        if (isPlayerBetType && playerStatsAvgsData) {
            console.log("Player Data.");
            console.log (playerStatsAvgsData);
        }

        return getGamesFeatureMap(historicalGameData)
            .concat(historicalOddsData)
            .concat(playerStatsAvgsData || []);
    }

    const getGamesFeatureMap = (historicalGameData: any): any => {
        return [];
    }

    const getOddsFeatureMap = (historicalOddsData: any): any => {
        return [];
    }

    const getPlayerStatsFeatureMap = (playerStatsAvgsData: any): any => {
        return [];
    }
    /********************************************************************************/

    /* action functions *************************************************************/
    /********************************************************************************/
    const runBacktest = ($event: any) => {
        $event.preventDefault();
        aggregateData();
    }

    
    const openAdvancedSettings = () => {
    };
    /********************************************************************************/

    
    /* html *************************************************************************/
    /********************************************************************************/
    return (
        <div className="backtest-parameters-form-container">
            {/* <div className="sub-header header">
                Backtest Parameters
            </div> */}
            <form className="form-body">
                <div className="strategy-inputs">
                    <div className="select-container">
                        <label className="select-label">Sports Category</label>
                        <Select
                            classNamePrefix="select"
                            options={sportsCategoriesOptions}
                            value={ sportsCategory ? { value: sportsCategory, label: sportsCategory } : null }
                            onChange={(x: any) => onSportsCategorySelection(x.value)}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </div>
                    <div className="select-container">
                        <label className="select-label">Season</label>
                        <Select
                            classNamePrefix="select"
                            options={seasonOptions}
                            value={ season ? { value: season, label: season } : null }
                            onChange={(x: any) => { if (x) onSeasonSelection(x.value) }}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </div>
                    {
                        sportsCategory && season ? 
                        <div className="select-container">
                            <label className="select-label">Team</label>
                            <Select
                                classNamePrefix="select"
                                options={teamOptions}
                                value={team ? { value: team, label: team } : null}
                                onChange={(x: any) => { if (x ) setTeam(x.value) }}
                                isClearable
                                styles={reactSelectStyles}
                            />
                        </div> : null
                    }
                    <div className="select-container">
                        <label className="select-label">Bet Type</label>
                        <Select
                            classNamePrefix="select"
                            options={betTypeOptions}
                            value={ betType ? { value: betType, label: betType } : null }
                            onChange={(x: any) => { if (x) onBetTypeSelection(x.value) }}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </div>
                    {
                        isPlayerBetType && team ? 
                        <div className="select-container">
                            <label className="select-label">Player</label>
                            <Select
                                classNamePrefix="select"
                                options={playerOptions}
                                value={ player ? { value: player.value, label: player.label } : null }
                                onChange={(x: any) => { if (x) setPlayer(x) }}
                                isClearable
                                styles={reactSelectStyles}
                            />
                        </div> : null
                    }
                    <div className="select-container">
                        <label className="select-label">Staking Strategy</label>
                        <Select
                            classNamePrefix="select"
                            options={stakingStrategyOptions}
                            value={ stakingStrategy ? { value: stakingStrategy, label: stakingStrategy } : null }
                            onChange={(x: any) => { if (x) setStakingStrategy(x.value) }}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </div>
                    <div className="select-container">
                        <label className="select-label">Odds Source</label>
                        <Select
                            classNamePrefix="select"
                            options={oddsSourceOptions}
                            value={ oddsSource ? { value: oddsSource, label: oddsSource } : null }
                            onChange={(x: any) => { if (x) setOddsSource(x.value) }}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </div>
                    <div className="input-container">
                        <label className="input-label">Bankroll USD</label>
                        <input placeholder='100'></input><span></span>
                    </div>
                    <div className="select-container">
                        <label className="select-label">Model</label>
                        <Select
                            classNamePrefix="select"
                            options={undefined}
                            value={() => {}}
                            onChange={() => {}}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </div>
                </div>
                <button className="run-button" onClick={runBacktest}>
                        Run
                </button>
            </form>
            <div className="advanced-settings-div">
                <span className="text-button" onClick={openAdvancedSettings}>
                    Advanced Settings
                </span>
            </div>
        </div>
    );
    /********************************************************************************/
}

export default BacktestParametersForm;