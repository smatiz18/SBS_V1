import { QuickStatsCellParams } from "../../../models/component/quick-stats-cell-params";
import './quick-stats-cell.component.scss';

const QuickStatsCell: React.FC<{params: QuickStatsCellParams}> = ({params}) => {

    const fixedLabel = isNaN(params.label) ? params.label : params.label.toFixed(2);
    return (
        <div className="quick-stats-cell-container">
            { 
                params.positive && 
                <span className="quick-stats-label-positive">{fixedLabel}</span>
            }
            { 
                params.negative && 
                <span className="quick-stats-label-negative">{fixedLabel}</span>
            }
            {
                !params.positive && !params.negative &&
                <span className="quick-stats-label">{fixedLabel}</span>
            }
        </div>
    );
}

export default QuickStatsCell;