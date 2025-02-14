import { QuickStatsTableParams } from "../../../../../models/component/quick-stats-table-params";
import QuickStatsCell from "../quick-stats-cell/quick-stats-cell.component";
import './quick-stats-table.component.scss';

const QuickStatsTable: React.FC<{ params: QuickStatsTableParams }> = ({ params }) => {
    return (
        <div className="quick-stats-table-component-container">
            <table>
                <tr>
                    {
                        params.headers.map((header) => (
                            <th>
                                <div className="header-wrapper">
                                    {header}
                                </div>
                            </th>
                        ))
                    }
                </tr>
                {
                    params.rows.map((row) => {
                        return (
                            <tr>
                                {
                                    row.map((cellParams) => {
                                        return (
                                            <td>
                                                <QuickStatsCell params={cellParams} />
                                            </td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    );
}

export default QuickStatsTable;