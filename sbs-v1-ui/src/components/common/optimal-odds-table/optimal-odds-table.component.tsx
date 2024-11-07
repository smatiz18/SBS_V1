import { OptimalOddsTableParams } from "../../../models/component/optimal-odds-table-params";
import './optimal-odds-table.component.scss';

const OptimalOddsTable: React.FC<{params: OptimalOddsTableParams}> = ({params}) => {
    // TODO make grid
    return (
        <div className="optimal-odds-table-container">
            <div className="optimal-odds-header-container">
                <h3>Optimal Odds</h3>
            </div>
            <div className="optimal-odds-table">
                <table>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OptimalOddsTable;