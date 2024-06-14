import Select from 'react-select';
import './backtest-parameters-form.scss';

const BacktestParametersForm = () => {
    return (
        <div className="backtest-parameters-form-container">
            <div className="sub-header header">
                Backtest Parameters
            </div>
            <form className="form-body">
                <div className="strategy-inputs">
                    <div className="minimal-select-container">
                        <label className="minimal-select-label">Test Label</label>
                        <Select
                            className="minimal-select"
                            classNamePrefix="select"
                            options={undefined}
                            value={() => {}}
                            onChange={() => {}}
                            isClearable
                        />
                    </div>
                    <div className="minimal-select-container">
                        <label className="minimal-select-label">Test Label</label>
                        <Select
                            className="minimal-select"
                            classNamePrefix="select"
                            options={undefined}
                            value={() => {}}
                            onChange={() => {}}
                            isClearable
                        />
                    </div>
                    <div className="minimal-select-container">
                        <label className="minimal-select-label">Test Label</label>
                        <Select
                            className="minimal-select"
                            classNamePrefix="select"
                            options={undefined}
                            value={() => {}}
                            onChange={() => {}}
                            isClearable
                        />
                    </div>
                    <div className="minimal-select-container">
                        <label className="minimal-select-label">Test Label</label>
                        <Select
                            className="minimal-select"
                            classNamePrefix="select"
                            options={undefined}
                            value={() => {}}
                            onChange={() => {}}
                            isClearable
                        />
                    </div>
                    <div className="minimal-select-container">
                        <label className="minimal-select-label">Test Label</label>
                        <Select
                            className="minimal-select"
                            classNamePrefix="select"
                            options={undefined}
                            value={() => {}}
                            onChange={() => {}}
                            isClearable
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default BacktestParametersForm;