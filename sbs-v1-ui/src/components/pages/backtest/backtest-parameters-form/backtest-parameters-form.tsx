import Select from 'react-select';
import './backtest-parameters-form.scss';
import { reactSelectStyles } from '../../../../models/form-styles/styles';

const BacktestParametersForm = () => {
    
    
    
    
    return (
        <div className="backtest-parameters-form-container">
            {/* <div className="sub-header header">
                Backtest Parameters
            </div> */}
            <form className="form-body">
                <div className="strategy-inputs">
                    <div className="select-container">
                        <label className="select-label">Strategy</label>
                        <Select
                            classNamePrefix="select"
                            options={undefined}
                            value={() => {}}
                            onChange={() => {}}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </div>
                    <div className="select-container">
                        <label className="select-label">Sports Category</label>
                        <Select
                            classNamePrefix="select"
                            options={undefined}
                            value={() => {}}
                            onChange={() => {}}
                            isClearable
                            styles={reactSelectStyles}
                        />
                    </div>
                    <button className="run-button">
                        Run
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BacktestParametersForm;