import { QuickStatsCellParams } from "../../../models/component/quick-stats-cell-params";
import './quick-stats-cell.component.scss';

const QuickStatsCell: React.FC<{params: QuickStatsCellParams}> = ({params}) => {

    const fixedLabel = isNaN(params.label) ? params.label : params.label.toFixed(2);
    return (
        <div className="quick-stats-cell-container">
            { 
                params.positive && 
                <div className="quick-stats-label-positive">
                    <span>{fixedLabel}</span>
                </div>
            }
            { 
                params.negative && 
                <div className="quick-stats-label-negative">
                    <span>{fixedLabel}</span>
                </div>
            }
            {
                params.aggregation &&
                <div className="quick-stats-label-aggregation">
                    <span >{fixedLabel}</span>
                </div>
            }
            {
                !params.positive && !params.negative && !params.aggregation &&
                <div className="quick-stats-label">
                    <span>{fixedLabel}</span>
                </div>
            }
        </div>
    );
}

export default QuickStatsCell;