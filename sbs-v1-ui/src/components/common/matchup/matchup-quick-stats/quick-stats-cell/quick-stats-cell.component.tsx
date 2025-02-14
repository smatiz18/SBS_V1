import { QuickStatsCellParams } from '../../../../../models/component/quick-stats-cell-params';
import './quick-stats-cell.component.scss';

const QuickStatsCell: React.FC<{ params: QuickStatsCellParams }> = ({ params }) => {
    /* consts ***********************************************************************/
    const fixedLabel = isNaN(params.label) ? params.label : params.label.toFixed(2);
    const getPositiveOrNegative = () => params.positive ?
        <span className="positive">{fixedLabel}</span> :
        params.negative ?
            <span className="negative">{fixedLabel}</span> :
            <span className="label">{fixedLabel}</span>;
    /********************************************************************************/

    return (
        <div className="quick-stats-cell-container">
            {
                params.aggregation &&
                <div className="quick-stats-agg">
                    {getPositiveOrNegative()}
                </div>
            }
            {
                !params.aggregation &&
                <div className="quick-stats">
                    {getPositiveOrNegative()}
                </div>
            }
        </div>
    );
}

export default QuickStatsCell;