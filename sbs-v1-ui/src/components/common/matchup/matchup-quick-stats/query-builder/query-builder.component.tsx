import { ThemeProvider } from "@mui/material/styles";
import QueryBuilder from "react-querybuilder";
import { darkTheme, formLabelSx, selectSx } from "../../../../../models/form-styles/styles";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormLabel, MenuItem } from "@mui/material";
import './query-builder.component.scss';
import { GameStatsOption } from "../../../../../models/enums/game-stats-option";

const SBSQueryBuilder: React.FC<{}> = () => {

    enum AvailableCollections {
        NbaGamePlayerStatsHistorical = 'NbaGamePlayerStatsHistorical',
        NbaGamesHistorical = 'NbaGamesHistorical',
        NbaPlayerAggregatedGameStatsHistorical = 'NbaPlayerAggregatedGameStatsHistorical',
        NbaTeamAggregatedGameStatsHistorical = 'NbaTeamAggregatedGameStatsHistorical',
        NbaTeamStatsHistorical = 'NbaTeamStats'  
    };

    const collectionSelectOptions = Object.values(AvailableCollections).map((co) => (
            <MenuItem value={co}>
                {co}
            </MenuItem>
        )
    );

    const collectionToAvailableFieldsMap: any = {};
    collectionToAvailableFieldsMap[AvailableCollections.NbaGamePlayerStatsHistorical] = [];
    collectionToAvailableFieldsMap[AvailableCollections.NbaGamesHistorical] = [];
    collectionToAvailableFieldsMap[AvailableCollections.NbaPlayerAggregatedGameStatsHistorical] = [];
    collectionToAvailableFieldsMap[AvailableCollections.NbaTeamAggregatedGameStatsHistorical] = [];
    collectionToAvailableFieldsMap[AvailableCollections.NbaTeamStatsHistorical] = [
        "league",
        "season",
        "dateStart",
        "teamsVisitorsName",
        "teamsVisitorsNickname",
        "teamsHomeName",
        "teamsHomeNickname",
        ...Object.values(GameStatsOption).flatMap((gso: any) => {
            return [ 
                `teamsHome${gso.toString().toUpperCase()}`,
                `teamsVisitor${gso.toString().toUpperCase()}`
            ];
        })
    ];

    const queryBuilderFields = collectionToAvailableFieldsMap[AvailableCollections.NbaTeamStatsHistorical]
        .map((f: any) => ({ name: f, label: f }));

    return (
        <div className='query-builder-container'>
            <div className='query-builder-options'>
                <div className='filter-option-wrapper'>
                     <ThemeProvider theme={darkTheme}>
                        <FormLabel id="demo-row-radio-buttons-group-label" sx={formLabelSx}>Data Source</FormLabel>
                        <div className="select-wrapper">
                            <FormControl variant="standard" sx={{ width: '100%'}}>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={AvailableCollections.NbaGamesHistorical}
                                    onChange={(x) => {}}
                                    sx={{...selectSx, fontSize: '.8rem'}}
                                >
                                    {collectionSelectOptions}
                                </Select>
                            </FormControl>
                        </div>
                    </ThemeProvider>
                </div>
            </div>
            <div className='query-builder-wrapper'>
                <QueryBuilder fields={queryBuilderFields}/>
            </div>
        </div>
    )
}

export default SBSQueryBuilder;