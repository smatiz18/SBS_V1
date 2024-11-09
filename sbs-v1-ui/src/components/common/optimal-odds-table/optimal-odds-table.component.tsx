import { OptimalOddsCell, OptimalOddsTableParams } from "../../../models/component/optimal-odds-table-params";
import OddsCell from "../odds-cell/odds-cell.component";
import './optimal-odds-table.component.scss';

const OptimalOddsTable: React.FC<{params: OptimalOddsTableParams}> = ({params}) => {
    const optimalOdds2dArr = new Array(params.rowOrdering.length + 1).fill(0).map(() => new Array(params.colOrdering.length + 1).fill(0));
    
    /** populate headers */
    /** description top left corner cell */
    if (optimalOdds2dArr[0] !== undefined && optimalOdds2dArr[0][0] !== undefined) {
        optimalOdds2dArr[0][0] = { description: params.description || '' };
    }

    params.colOrdering.forEach((colLabel: any, index: number) => {
        if (optimalOdds2dArr[0] !== undefined && optimalOdds2dArr[0][index + 1] !== undefined) {
            optimalOdds2dArr[0][index + 1] = { colHeader: colLabel };
        }
    });

    params.rowOrdering.forEach((rowLabel: any, index: number) => {
        if (optimalOdds2dArr[index + 1] !== undefined && optimalOdds2dArr[index + 1][0] !== undefined) {
            optimalOdds2dArr[index + 1][0] = { rowHeader: rowLabel };
        }
    });

    /** populate odds cells content */
    params.optimalOddsCells.forEach((optimalOddsCell: OptimalOddsCell) => {
        const colIdx = params.colOrdering.indexOf(optimalOddsCell.colKey);
        const rowIdx = params.rowOrdering.indexOf(optimalOddsCell.rowKey);
        
        optimalOdds2dArr[rowIdx + 1][colIdx + 1] = optimalOddsCell;
    });

    return (
        <div className="optimal-odds-table-container">
            <div className="optimal-odds-table">
                <table>
                    <tbody>
                        {
                            optimalOdds2dArr.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {
                                        row.map((cellContent: any, colIndex: number) => {
                                            if (cellContent.description !== undefined) {
                                                return (
                                                    <th key={colIndex}>
                                                        <div className="optimal-odds-table-description-cell">
                                                            {cellContent.description}
                                                        </div>
                                                    </th>
                                                );
                                            } else if (cellContent.colHeader !== undefined) {
                                                return (
                                                    <th key={colIndex}>
                                                        <div className="optimal-odds-table-col-header-cell">
                                                            {cellContent.colHeader}
                                                        </div>
                                                    </th>
                                                );
                                            } else if (cellContent.rowHeader !== undefined) {
                                                return (
                                                    <th key={colIndex}>
                                                        <div className="optimal-odds-table-row-header-cell">
                                                            {cellContent.rowHeader}
                                                        </div>
                                                    </th>
                                                );
                                            }
                                            return (
                                                <td key={colIndex}>
                                                    <OddsCell params={{ label: cellContent.point, odds: cellContent.price, bookmaker: cellContent.bookmaker }}/>
                                                </td>
                                            );     
                                        })
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OptimalOddsTable;