import { OptimalOddsTableParams } from "../../../models/component/optimal-odds-table-params";
import './optimal-odds-table.component.scss';

const OptimalOddsTable: React.FC<{params: OptimalOddsTableParams}> = ({params}) => {
    return (
        <div className="optimal-odds-table-container">
            <div className="optimal-odds-header-container">
                <h3>Optimal Odds</h3>
            </div>
        </div>
    );
}

export default OptimalOddsTable;