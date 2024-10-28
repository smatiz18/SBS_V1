import { BettingOddsCell, BettingOddsTableParams } from "../../../models/component/betting-odds-table-params";
import { Bookmaker } from "../../../models/odds/odds";
import OddsCell from "../odds-cell/odds-cell.component";

const BettingOddsTable: React.FC<{params: BettingOddsTableParams}> = ({params}) => {
    const uniqueCols = Object.values(new Set(params.bettingOddsCells.map((param: BettingOddsCell) => param.rowKey)));
    const uniqueRows = Object.values(new Set(params.bettingOddsCells.map((param: BettingOddsCell) => param.colKey)));

    /** TODO: assign some type of ordering */
    
    /** assign indices */
    const colKeyToIndexMap = uniqueCols.reduce((prev: any, curr: any, index: number) => {
        curr[prev] = index;
        return curr;
    }, {});

    const rowKeyToIndexMap = uniqueRows.reduce((prev: any, curr: any, index: number) => {
        curr[prev] = index;
        return curr;
    }, {});

    const bettingOdds2dArr = Array.from(
        { length: uniqueRows.length }, 
        () => Array(uniqueCols.length).fill(0)
    );

    params.bettingOddsCells.forEach((bettingOddsCell: BettingOddsCell) => {
        const colIdx = colKeyToIndexMap[bettingOddsCell.colKey];
        const rowIdx = rowKeyToIndexMap[bettingOddsCell.rowKey];
        bettingOdds2dArr[rowIdx].splice(colIdx, 0, bettingOddsCell);
    });

    const data: string[][] = [
        ["Cell 1,1", "Cell 1,2"],
        ["Cell 2,1", "Cell 2,2"]
    ];

    return (
        <div className='betting-odds-table-container'>
            <table className="custom-table">
                <tbody>
                {
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                        {row.map((cellContent, colIndex) => (
                            <td key={colIndex}>
                                <OddsCell label="poop" odds="-100"/>
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