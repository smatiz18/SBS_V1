import { BettingOddsCell, BettingOddsTableParams } from "../../../models/component/betting-odds-table-params";
import OddsCell from "../odds-cell/odds-cell.component";
import './betting-odds-table.component.scss';

const BettingOddsTable: React.FC<{params: BettingOddsTableParams}> = ({params}) => {
    const uniqueCols = new Set(params.bettingOddsCells.map((param: BettingOddsCell) => param.colKey));
    const uniqueRows = new Set(params.bettingOddsCells.map((param: BettingOddsCell) => param.rowKey));

    /** TODO: assign some type of ordering & error handling */
    
    /** assign indices */
    const colKeyToIndexMap = Array.from(uniqueCols.values()).reduce((prev: any, curr: any, index: number) => {
        prev[curr] = index;
        return prev;
    }, {});

    const rowKeyToIndexMap = Array.from(uniqueRows.values()).reduce((prev: any, curr: any, index: number) => {
        prev[curr] = index;
        return prev;
    }, {});

    const bettingOdds2dArr = new Array(uniqueRows.size + 1).fill(0).map(() => new Array(uniqueCols.size + 1).fill(0));


    /** populate headers */
    Object.entries(colKeyToIndexMap).forEach((kv: any[]) => {
        if (bettingOdds2dArr[0] && bettingOdds2dArr[0][kv[1]]) {
            bettingOdds2dArr[0][kv[1]] = { header: kv[0] };
        }
    });

    Object.entries(rowKeyToIndexMap).forEach((kv: any[], index: number) => {
        if (bettingOdds2dArr[kv[1]] && bettingOdds2dArr[kv[1]][0]) {
            bettingOdds2dArr[kv[1]][0] = { header: kv[0] };
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
            <table className="betting-odds-table">
                <tbody>
                {
                    bettingOdds2dArr.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                        {row.map((cellContent: any, colIndex: number) => {
                            if (cellContent.header) {
                                return (
                                    <td key={colIndex}>
                                        <div odds-table-header-cell>
                                            {cellContent.header}
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
    )
}

export default BettingOddsTable;