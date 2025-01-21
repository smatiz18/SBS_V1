import { useEffect, useState } from "react";
import SBSQueryBuilder from "../query-builder/query-builder.component"
import Button from "@mui/material/Button";
import './past-occurrences.component.scss';
import { ThemeProvider } from "@emotion/react";
import { darkTheme } from "../../../../../models/form-styles/styles";

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
            <div className="sbs-query-builders-wrapper">
                {queryBuilders}
            </div>
            
                <div className="button-wrapper">
                    { queryBuilders.length < 4 && 
                        <ThemeProvider theme={darkTheme}>
                            <Button variant="outlined" size="small" onClick={addNewQueryBuilder}>+</Button>
                        </ThemeProvider>
                    }
                </div>
        </div>
    )
}

export default PastOccurrences;