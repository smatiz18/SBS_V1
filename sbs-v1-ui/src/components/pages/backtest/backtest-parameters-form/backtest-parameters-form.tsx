import Select from 'react-select';
import './backtest-parameters-form.scss';
import { reactSelectStyles } from '../../../../models/form-styles/styles';
import { SportsCategories } from '../../../../models/sports-categories.models';
import { useState } from 'react';
import { StakingStrategies } from '../../../../models/staking-strategies.models';
import { OddsSources } from '../../../../models/odds-sources.models';
import { TeamBetTypes } from '../../../../models/team-bet-types.models';
import { PlayerBetTypes } from '../../../../models/player-bet-types.models';
import { NbaTeams } from '../../../../constants/nba';
import { get_nba_games_by_team_and_season, get_nba_odds_by_team_and_season } from '../../../../services/nba/services';
import { Market, NbaOddsHistorical } from '../../../../models/nba-odds-historical';

const BacktestParametersForm = () => {
    const [sportsCategory, setSportsCategory] = useState(null as unknown as SportsCategories);
    const [season, setSeason] = useState(null);
    const [betType, setBetType] = useState(null as unknown as TeamBetTypes | PlayerBetTypes);
    const [stakingStrategy, setStakingStrategy] = useState(null); 
    const [oddsSource, setOddsSource] = useState(null);
    const [isTeamBetType, setIsTeamBetType] = useState(false);
    const [isPlayerBetType, setIsPlayerBetType] = useState(false);
    const [teamOptions, setTeamOptions] = useState([] as any);
    const [playerOptions, setPlayerOptions] = useState([] as any);
    const [team, setTeam] = useState(null);
    const [player, setPlayer] = useState(null);
    const [historicalGameData, setHistoricalGameData] = useState([] as any);
    const [historicalOddsData, setHistoricalOddsData] = useState([] as any);

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

    const onSportsCategorySelection = (sportsCategory: SportsCategories) => {
        setSportsCategory(sportsCategory);
        loadTeamOptions(season, sportsCategory);
    }

    const onSeasonSelection = (season: any) => {
        setSeason(season);
        loadTeamOptions(season, sportsCategory);
    }

    const loadTeamOptions = (season: any, sportsCategory: SportsCategories) => {
        getAndSetTeamOptions(season, sportsCategory);
    }

    const runBacktest = ($event: any) => {
        $event.preventDefault();
        aggregateData();
    }

    const aggregateData = () => {
        let featureMap;
        switch(sportsCategory) {
            case (SportsCategories.NBA): {
                const teamName = NbaTeams.find((teamObj: any) => teamObj.teamNickname === team )?.teamName;
                const games_p = get_nba_games_by_team_and_season({ season: season!, teamNickname: team! });
                const odds_p = get_nba_odds_by_team_and_season({ season: season!, teamName: encodeURIComponent(teamName!) })
                Promise.all([games_p, odds_p])
                    .then(([games_resp, odds_resp]) => {
                        setHistoricalGameData(games_resp.data);
                        setHistoricalOddsData(odds_resp.data);
                        featureMap = getFeatureMap(games_resp.data, odds_resp.data, betType, oddsSource!);
                    })
                    .catch((error: any) => {
                        console.error("Error fetching NBA games and odds data:", error);
                        setHistoricalGameData([]);
                        setHistoricalOddsData([]);
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
        oddsSource: OddsSources
    ) => {
        const filteredOddsData = parseOddsData(historicalOddsData, betType, oddsSource);
        console.log("Odds Data.");
        console.log(filteredOddsData);

        console.log("Games Data.");
        console.log(historicalGameData);   
    }

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

    const onBetTypeSelection = (betType: TeamBetTypes | PlayerBetTypes) => {
        setBetType(betType);
        if (new Set(Object.values(TeamBetTypes)).has(betType as TeamBetTypes)) {
            setIsTeamBetType(true);
            setIsPlayerBetType(false);
        } else {
            setIsPlayerBetType(true);
            setIsTeamBetType(false);
        }
    }

    const getAndSetTeamOptions = (_season: any, sport: SportsCategories) => {
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

    const getPlayerOptions = (season: any, sport: SportsCategories) => {
        setPlayerOptions([] as any);
    };

    const openAdvancedSettings = () => {

    };

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
                            onChange={(x: any) => onSeasonSelection(x.value)}
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
                                onChange={(x: any) => setTeam(x.value)}
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
                            onChange={(x: any) => onBetTypeSelection(x.value)}
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
                                value={ player ? { value: player, label: player } : null }
                                onChange={(x: any) => setPlayer(x.value)}
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
                            onChange={(x) => setStakingStrategy(x!.value)}
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
                            onChange={(x) => setOddsSource(x!.value)}
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
}

export default BacktestParametersForm;