import { BettingOddsCell, BettingOddsTableParams } from "../../../../../models/component/betting-odds-table-params";
import OddsCell from "../odds-cell/odds-cell.component";
import './betting-odds-table.component.scss';

const BettingOddsTable: React.FC<{params: BettingOddsTableParams}> = ({params}) => {
    // TODO add description cell
    
    /* consts ***********************************************************************/
    const bettingOdds2dArr = new Array(params.rowOrdering.length + 1).fill(0).map(() => new Array(params.colOrdering.length + 1).fill(0));
    /********************************************************************************/

    /* table building workflow ******************************************************/
    /** populate headers */
    /** description top left corner cell */
    if (bettingOdds2dArr[0] !== undefined && bettingOdds2dArr[0][0] !== undefined) {
        bettingOdds2dArr[0][0] = { tableDescription: params.description || '' };
    }

    params.colOrdering.forEach((colLabel: any, index: number) => {
        if (bettingOdds2dArr[0] !== undefined && bettingOdds2dArr[0][index + 1] !== undefined) {
            bettingOdds2dArr[0][index+ 1] = { colHeader: colLabel };
        }
    });

    params.rowOrdering.forEach((rowLabel: any, index: number) => {
        if (bettingOdds2dArr[index + 1] !== undefined && bettingOdds2dArr[index + 1][0] !== undefined) {
            bettingOdds2dArr[index + 1][0] = { rowHeader: rowLabel };
        }
    });

    /** populate odds cells content */
    params.bettingOddsCells.forEach((bettingOddsCell: BettingOddsCell) => {
        const colIdx = params.colOrdering.indexOf(bettingOddsCell.colKey);
        const rowIdx = params.rowOrdering.indexOf(bettingOddsCell.rowKey);
        
        bettingOdds2dArr[rowIdx + 1][colIdx + 1] = bettingOddsCell;
    });
    /********************************************************************************/

    return (
        <div className='betting-odds-table-container'>
            <div className="betting-odds-table">
                <table >
                    <tbody>
                        {
                            bettingOdds2dArr.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {
                                        row.map((cellContent: any, colIndex: number) => {
                                            if (cellContent.tableDescription !== undefined) {
                                                return (
                                                    <th key={colIndex}>
                                                        <div className="odds-table-description-cell">
                                                            {cellContent.tableDescription}
                                                        </div>
                                                    </th>
                                                );
                                            }
                                            if (cellContent.colHeader !== undefined) {
                                                return (
                                                    <th key={colIndex}>
                                                        <div className="odds-table-col-header-cell">
                                                            {cellContent.colHeader}
                                                        </div>
                                                    </th>
                                                );
                                            }
                                            if (cellContent.rowHeader !== undefined) {
                                                return (
                                                    <th key={colIndex}>
                                                        <div className="odds-table-row-header-cell">
                                                            {cellContent.rowHeader}
                                                        </div>
                                                    </th>
                                                );
                                            }
                                            return (
                                                <td key={colIndex}>
                                                    <OddsCell params={
                                                        { 
                                                            label: cellContent.point?.toString() || '', 
                                                            odds: cellContent.price?.toString() || '-',
                                                            bookmaker: params.bookmaker
                                                        }
                                                    }/>
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
    )
}

export default BettingOddsTable;