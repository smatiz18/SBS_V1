import { useEffect, useState } from "react";
import SBSQueryBuilder from "../query-builder/query-builder.component"
import Button from "@mui/material/Button";
import './past-occurrences.component.scss';
import { ThemeProvider } from "@emotion/react";
import { accordianSummarySx, darkTheme, filterAccordianSx } from "../../../../../models/form-styles/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from "@mui/material/AccordionDetails";

const PastOccurrences: React.FC<{}> = ({}) => {
    const [queryBuilders, setQueryBuilders] = useState([] as any[]);
    const [nextId, setNextId] = useState(-1);
    
    useEffect(() => {
        addNewQueryBuilder();
    }, []);

    const getNextId = () => {
        const newNextId = nextId + 1;
        setNextId(newNextId);
        return nextId;
    };

    const handleDeleteQueryBuilder = (id: any) => {
        setQueryBuilders((currQueryBuilders: any[]) => {
            return currQueryBuilders.filter((comp: any) => comp.props?.id !== id.toString());
        });
    };
    
    const addNewQueryBuilder = () => {
        setQueryBuilders((currQueryBuilders: any) => {
            const id = getNextId().toString();
            return currQueryBuilders.concat(
                (
                    <div className='sbs-query-builder-wrapper' id={id}>
                        <SBSQueryBuilder id={id} deleteQueryBuilder={handleDeleteQueryBuilder}/>
                    </div>
                )
            )
        });
    };

    return (
        <div className='past-occurrences-container'>
            <ThemeProvider theme={darkTheme}>
                <Accordion sx={filterAccordianSx} defaultExpanded={true}>
                    <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            sx={accordianSummarySx}
                        >
                            Past Occurrences
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="sbs-query-builders-wrapper">
                                {queryBuilders}
                            </div>
                        </AccordionDetails>
                        <AccordionDetails>
                            { 
                                queryBuilders.length < 4 &&  
                                    (
                                        <div className="button-wrapper">
                                            <Button variant="outlined" size="small" onClick={addNewQueryBuilder}>+</Button>
                                        </div>
                                    )
                            }
                        </AccordionDetails>
                </Accordion>
            </ThemeProvider>
        </div>
    )
}

export default PastOccurrences;