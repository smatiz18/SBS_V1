import Select from 'react-select';
import './backtest-parameters-form.scss';
import { reactSelectStyles } from '../../../../models/form-styles/styles';
import { SportsCategories } from '../../../../models/sports-categories.models';
import { useState } from 'react';
import { BetOptions } from '../../../../models/bet-options.models';
import { BetType } from '../../../../models/bet-types.models';
import { StakingStrategies } from '../../../../models/staking-strategies.models';
import { OddsSources } from '../../../../models/odds-sources.models';
import { Switch } from '@mui/material';

const BacktestParametersForm = () => {
    const [sportsCategory, setSportsCategory] = useState(null);
    const [season, setSeason] = useState(null);
    const [betOption, setBetOption] = useState(null);
    const [betType, setBetType] = useState(null);
    const [stakingStrategy, setStakingStrategy] = useState(null); 
    const [oddsSource, setOddsSource] = useState(null);
    
    const sportsCategoriesOptions: any[] = Object.values(SportsCategories).map((v) => {
        return { value: v, label: v };
    });
    const seasonOptions: any[] = [
        { value: 2023, label: 2023 }
    ];
    const betOptionOptions: any[] = Object.values(BetOptions).map((v) => {
        return { value: v, label: v };
    });
    const betTypeOptions: any[] = Object.values(BetType).map((v) => {
        return { value: v, label: v };
    });
    const stakingStrategyOptions: any[] = Object.values(StakingStrategies).map((v) => {
        return { value: v, label: v };
    });
    const oddsSourceOptions: any[] = Object.values(OddsSources).map((v) => {
        return { value: v, label: v };
    });

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
                            value={sportsCategory}
                            onChange={(x) => setSportsCategory(x)}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </div>
                    <div className="select-container">
                        <label className="select-label">Season</label>
                        <Select
                            classNamePrefix="select"
                            options={seasonOptions}
                            value={season}
                            onChange={(x) => setSeason(x)}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </div>
                    <div className="select-container">
                        <label className="select-label">Bet Option</label>
                        <Select
                            classNamePrefix="select"
                            options={betOptionOptions}
                            value={betOption}
                            onChange={(x) => setBetOption(x)}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </div>
                    <div className="select-container">
                        <label className="select-label">Bet Type</label>
                        <Select
                            classNamePrefix="select"
                            options={betTypeOptions}
                            value={betType}
                            onChange={(x) => setBetType(x)}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </div>
                    <div className="select-container">
                        <label className="select-label">Staking Strategy</label>
                        <Select
                            classNamePrefix="select"
                            options={stakingStrategyOptions}
                            value={stakingStrategy}
                            onChange={(x) => setStakingStrategy(x)}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </div>
                    <div className="select-container">
                        <label className="select-label">Odds Source</label>
                        <Select
                            classNamePrefix="select"
                            options={oddsSourceOptions}
                            value={oddsSource}
                            onChange={(x) => setOddsSource(x)}
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