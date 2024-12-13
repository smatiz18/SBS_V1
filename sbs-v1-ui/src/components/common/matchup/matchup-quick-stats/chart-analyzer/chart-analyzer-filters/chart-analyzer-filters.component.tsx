import { ThemeProvider } from "@mui/material/styles";
import { accordianSummarySx, darkTheme, filterAccordianSx } from "../../../../../../models/form-styles/styles";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ChartAnalyzerFilters: React.FC<{}> = () => {
    return (
        <div className="chart-analyzer-filters-container">
            <ThemeProvider theme={darkTheme}>
                <Accordion sx={filterAccordianSx}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={accordianSummarySx}
                    >
                        Filters
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* {getAccordianDetails()} */}
                    </AccordionDetails>
                </Accordion>
            </ThemeProvider>
        </div>
    );
}

export default ChartAnalyzerFilters;