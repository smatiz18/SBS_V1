import { BettingOddsCell, BettingOddsTableParams } from "../../../models/component/betting-odds-table-params";
import OddsCell from "../odds-cell/odds-cell.component";
import './betting-odds-table.component.scss';

const BettingOddsTable: React.FC<{params: BettingOddsTableParams}> = ({params}) => {
    const uniqueCols = new Set(params.bettingOddsCells.map((param: BettingOddsCell) => param.colKey));
    const uniqueRows = new Set(params.bettingOddsCells.map((param: BettingOddsCell) => param.rowKey));

    /** TODO: assign some type of ordering */
    
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

    params.bettingOddsCells.forEach((bettingOddsCell: BettingOddsCell) => {
        const colIdx = colKeyToIndexMap[bettingOddsCell.colKey];
        const rowIdx = rowKeyToIndexMap[bettingOddsCell.rowKey];
        
        bettingOdds2dArr[rowIdx + 1][colIdx + 1] = bettingOddsCell;
    });

    return (
        <div className='betting-odds-table-container'>
            <table className="custom-table">
                <tbody>
                {
                    bettingOdds2dArr.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                        {row.map((cellContent: BettingOddsCell, colIndex: number) => (
                            <td key={colIndex}>
                                <OddsCell params={{ label: cellContent.point?.toString() || '', odds: cellContent.price?.toString() || ''}}/>
                            </td>
                        ))}
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}

export default BettingOddsTable;