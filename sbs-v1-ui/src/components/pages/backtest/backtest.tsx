import BacktestParametersForm from "./backtest-parameters-form/backtest-parameters-form";
import './backtest.scss';

const Backtest = () => {
  return (
    <div className="page-container">
      <div className="header">
          <h1 className="header-title">Backtest</h1>
      </div>
      <div className="content">
        <BacktestParametersForm/>
      </div>
      <div className="footer">
      </div>
    </div>
  );
}

export default Backtest;