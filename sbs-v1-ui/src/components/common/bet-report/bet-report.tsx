import React, { useState } from 'react';
import { Button, FormControl, FormLabel, MenuItem, Select, Slider } from '@mui/material';
import { darkTheme, formLabelSx, selectSx, smallFontSelectSx } from '../../../models/form-styles/styles';
import { StakingStrategies } from '../../../models/enums/staking-strategies';
import { ThemeProvider } from '@emotion/react';
import { AllCommunityModule, colorSchemeDarkBlue, GridReadyEvent, ModuleRegistry, themeQuartz } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react';
import { Bookmakers } from '../../../models/enums/bookmakers';
import OddsCell from '../matchup/matchup-lines/odds-cell/odds-cell.component';
import { calculateEV, calculateImpliedProbability, calculateKellyCriterion, calculatePayout } from '../../../utils/utils';
import './bet-report.scss';

ModuleRegistry.registerModules([AllCommunityModule]);

const BetReport: React.FC<{id: string}> = ({}) => {
    const mockRowData = [
        {
            id: 1,
            modelName: 'SBS Model',
            description: 'Jaylen Brunson',
            betType: 'Pts',
            line: {
                label: 'O 25.5',
                odds: '-115',
                bookmaker: Bookmakers.DraftKings,
            },
            lineProbability: 0.7,
            modelProbabiltiy: 0.8,
            backtestAccuracy: 0.8,
            EV: 0.5,
            betSize: 10
        },
        {
            id: 2,
            modelName: 'SBS Model',
            description: 'Jaylen Brown',
            betType: 'Ass',
            line: {
                label: 'U 12.5',
                odds: '-110',
                bookmaker: Bookmakers.FanDuel,
            },
            lineProbability: 0.7,
            modelProbabiltiy: 0.8,
            backtestAccuracy: 0.6,
            EV: 0.5,
            betSize: 10
        },
        {
            id: 3,
            modelName: 'Std Dev Reversion',
            description: 'Knicks @ Celtics',
            betType: 'Total',
            line: {
                label: 'O 222.5',
                odds: '+400',
                bookmaker: Bookmakers.FanDuel,
            },
            lineProbability: 0.7,
            modelProbabiltiy: 0.1,
            backtestAccuracy: 0.78,
            EV: 0.5,
            betSize: 10
        },
        {
            id: 4,
            modelName: 'SBS Model',
            description: 'Jaylen Brown',
            betType: 'Reb',
            line: {
                label: 'O 10.5',
                odds: '+100',
                bookmaker: Bookmakers.BetMGM,
            },
            lineProbability: 0.7,
            modelProbabiltiy: 0.8,
            backtestAccuracy: 0.98,
            EV: 0.5,
            betSize: 10
        },
    ];

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState(mockRowData);

    const decimalValueFormatter = (params: any) => {
        if (params !== undefined && params.value !== undefined) {
            return params.value.toFixed(2);
        }
        return '-';
    };

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        { 
            field: 'description',
            headerName: 'Desc.',
            pinned: 'left',
        },  
        { 
            field: 'betType',
            pinned: 'left',
        },
        { 
            field: 'line',
            cellRenderer: (params: any) => {
                return (
                    <OddsCell params={params.data.line} />
                )
            },
            width: 85,
            pinned: 'left',
        },
        { 
            field: 'lineProbability',
            headerName: 'Line Prob.',
            valueFormatter: decimalValueFormatter,
            width: 60,
        },
        { 
            field: 'modelProbabiltiy',
            headerName: 'Model Prob.',
            valueFormatter: decimalValueFormatter,
            width: 60,
        },
        { 
            field: 'backtestAccuracy',
            headerName: 'Backtest Acc.',
            valueFormatter: decimalValueFormatter,
            width: 60,
        },
        { 
            field: 'ev',
            headerName: 'EV',
            valueFormatter: decimalValueFormatter,
            minWidth: 100,
            sort: 'desc',
            pinned: 'right',
            comparator: (a: number, b: number) => a - b, // optional if EV is numeric
            cellStyle: (params: any) => {
                const value = params.value;
            
                if (typeof value !== 'number') return {};
            
                // const intensity = Math.min(Math.abs(value) / 1.0, 1); // scale 0 to 1
                const blue = '#64D6FF';
                const red = '#F92572';
                const color = value >= 0
                  ? blue
                  : red;

                return {
                  color: color,
                  fontWeight: 600,
                };
            },

        },
        { 
            field: 'payout',
            pinned: 'right',
            valueFormatter: decimalValueFormatter
        }, 
        { 
            field: 'betSize',
            pinned: 'right',
            valueFormatter: decimalValueFormatter
        }
    ]);

    const [stakingStrategy, setStakingStrategy] = useState(StakingStrategies.KellyCriterion.toString());
    const [bankroll, setBankRoll] = useState(100);
    const [fractionalKelly, setFractionalKelly] = useState(1);
    
    const onGridReady = (params: GridReadyEvent) => {
        const allColumnIds: string[] = [];
        params.api.getAllGridColumns().forEach((col) => {
          allColumnIds.push(col.getId());
        });
        params.api.autoSizeColumns(allColumnIds, false);
        onCalculate();
    };

    const calculateBetSize = (modelProbabiltiy: number, americanOdds: number) => {
        let betSize = 0;
        switch (stakingStrategy) {
            case StakingStrategies.KellyCriterion.toString():
                betSize = bankroll * calculateKellyCriterion(fractionalKelly, modelProbabiltiy, americanOdds);
                break;
            default:
                break;
        }
        return betSize;
    };

    const onCalculate = () => {
        const newRowData = rowData.map((row) => {
            const lineOdds = parseFloat(row.line.odds.replace(/[^\d.-]/g, ''))
            const lineProbability = calculateImpliedProbability(lineOdds);
            const betSize = calculateBetSize(row.modelProbabiltiy, lineOdds);
            const payout = calculatePayout(lineOdds, betSize);
            const ev = calculateEV(row.modelProbabiltiy, payout, betSize);
            return {
                ...row,
                lineProbability: lineProbability,
                ev: ev,
                payout: payout,
                betSize: betSize
            }
        });
        setRowData(newRowData);
    };

    return (
        <div className='bet-report-container'>
            {/* <ThemeProvider theme={darkTheme}> */}
                <div className='params-wrapper'>
                    <div className='params'>
                        <div className='param-wrapper'>
                            <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Staking Strategy</FormLabel>
                            <div className="select-wrapper">
                                <FormControl variant="standard" sx={{ width: '100%'}}>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={StakingStrategies.KellyCriterion.toString()}
                                        onChange={(x) => setStakingStrategy(x.target.value)}
                                        sx={{ ...selectSx, fontSize: '.8rem' }}
                                    >
                                        <MenuItem value={StakingStrategies.KellyCriterion.toString()}>
                                            {StakingStrategies.KellyCriterion.toString()}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className='param-wrapper'>
                            <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Bankroll</FormLabel>
                            <div className='input-wrapper'>
                                <input type='number' defaultValue={bankroll} onChange={(x) => setBankRoll(x.target.valueAsNumber)}></input>
                            </div>
                        </div>
                        {
                            stakingStrategy === StakingStrategies.KellyCriterion.toString() && (
                                <div className='betting-strategy-params'>
                                    <div className='param-wrapper'>
                                        <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Fractional Kelly</FormLabel>
                                        <div className='slider-wrapper'>
                                            <Slider
                                                aria-label="Small steps"
                                                defaultValue={fractionalKelly}
                                                getAriaValueText={() => ''}
                                                step={.05}
                                                onChange={(_x, v) => setFractionalKelly(v as number)}
                                                marks={
                                                    [
                                                        {
                                                            value: 0,
                                                            label: '0'
                                                        },
                                                        {
                                                            value: .5,
                                                            label: '.5'
                                                        },
                                                        {
                                                            value: 1,
                                                            label: '1'
                                                        }
                                                    ]
                                                }
                                                min={0}
                                                max={1}
                                                valueLabelDisplay="auto"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <div className='calculate-button-wrapper'>
                            <Button variant="outlined" size="small" onClick={()=> onCalculate()} sx={{ ...smallFontSelectSx, textTransform: 'none' }}>Calculate</Button>
                        </div>
                    </div>
                </div>
            {/* </ThemeProvider> */}
            <div className='content-wrapper'>
                <div className='content'>
                    <div className='grid-wrapper' style={{ flex: 1 }}>
                        <AgGridReact
                            theme={themeQuartz.withPart(colorSchemeDarkBlue)}
                            gridOptions={{
                                rowHeight: 47.5
                            }}
                            rowData={rowData}
                            columnDefs={colDefs as any}
                            domLayout="autoHeight"
                            onGridReady={onGridReady}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BetReport;