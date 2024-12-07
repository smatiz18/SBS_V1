import { useState } from "react";
import { BetOptions } from "../../../../../models/enums/bet-options";
import { Matchup } from "../../../../../models/matchup";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Filters: React.FC<{betOption: BetOptions, matchup: Matchup}> = ({betOption, matchup}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="filters-container">
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    Accordion 1
                </AccordionSummary>
                <AccordionDetails>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default Filters;