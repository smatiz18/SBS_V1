import { BettingOddsCell, BettingOddsTableParams } from "../../../models/component/betting-odds-table-params";
import OddsCell from "../odds-cell/odds-cell.component";
import './betting-odds-table.component.scss';

const BettingOddsTable: React.FC<{params: BettingOddsTableParams}> = ({params}) => {
    const uniqueCols = Array.from(new Set(params.bettingOddsCells.map((param: BettingOddsCell) => param.colKey)));
    const uniqueRows = Array.from(new Set(params.bettingOddsCells.map((param: BettingOddsCell) => param.rowKey)))
        .sort((a: any, b: any) => {
            return params.rowOrdering.findIndex((rowKey: any) => rowKey === a) - params.rowOrdering.findIndex((rowKey: any) => rowKey === b);
        });
    
    /** assign indices */
    const colKeyToIndexMap = uniqueCols.reduce((prev: any, curr: any, index: number) => {
        prev[curr] = index;
        return prev;
    }, {});

    const rowKeyToIndexMap = uniqueRows.reduce((prev: any, curr: any, index: number) => {
        prev[curr] = index;
        return prev;
    }, {});

    const bettingOdds2dArr = new Array(uniqueRows.length + 1).fill(0).map(() => new Array(uniqueCols.length + 1).fill(0));

    /** populate headers */
    /** empty top left corner cell */
    if (bettingOdds2dArr[0] !== undefined && bettingOdds2dArr[0][0] !== undefined) {
        bettingOdds2dArr[0][0] = { colHeader: '' };
    }

    Object.entries(colKeyToIndexMap).forEach((kv: any[]) => {
        if (bettingOdds2dArr[0] !== undefined && bettingOdds2dArr[0][kv[1] + 1] !== undefined) {
            bettingOdds2dArr[0][kv[1] + 1] = { colHeader: kv[0] };
        }
    });

    Object.entries(rowKeyToIndexMap).forEach((kv: any[], index: number) => {
        if (bettingOdds2dArr[kv[1] + 1] !== undefined && bettingOdds2dArr[kv[1] + 1][0] !== undefined) {
            bettingOdds2dArr[kv[1] + 1][0] = { rowHeader: kv[0] };
        }
    });

    /** populate odds cells content */
    params.bettingOddsCells.forEach((bettingOddsCell: BettingOddsCell) => {
        const colIdx = colKeyToIndexMap[bettingOddsCell.colKey];
        const rowIdx = rowKeyToIndexMap[bettingOddsCell.rowKey];
        
        bettingOdds2dArr[rowIdx + 1][colIdx + 1] = bettingOddsCell;
    });

    return (
        <div className='betting-odds-table-container'>
            <div className="betting-odds-table">
                <table >
                    <tbody>
                    {
                        bettingOdds2dArr.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                            {row.map((cellContent: any, colIndex: number) => {
                                if (cellContent.colHeader !== undefined) {
                                    return (
                                        <td key={colIndex}>
                                            <div className="odds-table-col-header-cell">
                                                {cellContent.colHeader}
                                            </div>
                                        </td>
                                    );
                                }
                                if (cellContent.rowHeader !== undefined) {
                                    return (
                                        <td key={colIndex}>
                                            <div className="odds-table-row-header-cell">
                                                {cellContent.rowHeader}
                                            </div>
                                        </td>
                                    );
                                }
                                return (
                                    <td key={colIndex}>
                                        <OddsCell params={{ label: cellContent.point?.toString() || '', odds: cellContent.price?.toString() || ''}}/>
                                    </td>
                                );     
                            })}
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