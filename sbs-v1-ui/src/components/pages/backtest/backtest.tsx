import BacktestParametersForm from "./backtest-parameters-form/backtest-parameters-form";
import './backtest.scss';
import PerformanceChart from "./performance-chart/performance-chart";

const Backtest = () => {
  return (
    <div className="backtest-container">
      <div className="page-container">
        <div className="header">
            <h1 className="header-title">Backtest</h1>
        </div>
        <div className="content">
          <div className="chart-params">
            <BacktestParametersForm/>
          </div>
          <div className="chart">
            <PerformanceChart/>
          </div>
        </div>
        <div className="footer">
        </div>
      </div>
    </div>
  );
}

export default Backtest;