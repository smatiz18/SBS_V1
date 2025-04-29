import Pagination from "@mui/material/Pagination";
import { MatchupLinesAndStats } from "../../../../models/matchup-lines-and-stats";
import MatchupBookmakerLines from "./bookmaker-lines/matchup-bookmaker-lines.component";
import MatchupOptimalOdds from "./optimal-odds/matchup-optimal-odds.component";
import PaginationItem from "@mui/material/PaginationItem";
import { paginationSx } from "../../../../models/form-styles/styles";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { BetOptions } from "../../../../models/enums/bet-options";
import { GetOddsResponse } from "../../../../models/services/get-odds-response";
import { getEventOdds } from "../../../../services/odds/services";
import { supportedTeamMarketsBySport } from "../../../../models/enums/team-bet-types";
import { OddsApiSports, sportsKeyToOddsApiSports } from "../../../../models/enums/odds-api-sports";
import { supportedPlayerMarketsBySport } from "../../../../models/enums/player-bet-types";
import { GetEventOddsRequest } from "../../../../models/services/get-event-odds-request";
import { OddsApiRegions } from "../../../../models/enums/odds-api-regions";
import { OddsFormat } from "../../../../models/enums/odds-format";
import { Bookmakers } from "../../../../models/enums/bookmakers";
import { grizzliesMagicPlayerOdds, grizzliesMagicTeamOdds, knicksCavsPlayersOdds, knicksCavsTeamOdds } from "../../../../test/nba-matchups-mocks";
import TooltipIcon from "../../../common/tooltip/tooltip-icon";
import { getCurrentDateEst } from "../../../../utils/utils";
import { waveform } from 'ldrs';
import { motion } from "framer-motion";
import './matchup-lines.component.scss';

const MatchupLines: React.FC<{
    matchup: MatchupLinesAndStats, 
    betOption: BetOptions, 
    selectedPlayerName: string}> = ({matchup, betOption, selectedPlayerName}) => {  
    
    waveform.register();
    /* consts ***********************************************************************/
    const USE_MOCKS = false;
    const pageLabels = ['Optimal Odds', 'Bookmaker Lines'];
    const oddsApiSport = sportsKeyToOddsApiSports.get(matchup.oddsEvent?.sportKey || '') as OddsApiSports || null;
    const [shouldRender, setShouldRender] = useState(false);

    const getBookmakerLinesComp = () => (
        currentEventOdds.events[0] && shouldRender && 
        <motion.div
            className="fade-in"
            initial={{ opacity: 0, transform: "translateY(10px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        > 
            <MatchupBookmakerLines 
                matchup={{...matchup}} 
                betOption={betOption}
                eventOdds={currentEventOdds.events[0]}
                oddsApiSport={oddsApiSport}
                selectedPlayerName={selectedPlayerName}
            />
        </motion.div> as ReactElement
    );
    
    const getOtimalOddsComp = () => (
        shouldRender &&
        <motion.div
            className="fade-in"
            initial={{ opacity: 0, transform: "translateY(10px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <MatchupOptimalOdds 
                matchup={{ ...matchup }} 
                betOption={betOption} 
                teamOptimalOdds={betOption === BetOptions.Team ? currentEventOdds.teamOptimalOddsMap![matchup.oddsEvent?.id || ''] : undefined }
                playerOptimalOdds={betOption === BetOptions.Player ? currentEventOdds.playerOptimalOddsMap![matchup.oddsEvent?.id || '']: undefined}
                oddsApiSport={oddsApiSport}
                selectedPlayerName={selectedPlayerName} 
            />
        </motion.div> as ReactElement
    );
    
    const [currentEventOdds, setCurrentEventOdds] = useState({ events: [], teamOptimalOddsMap: {}, playerOptimalOddsMap: {} } as GetOddsResponse);
    const [currentPageIdx, setCurrentPageIdx] = useState(1);
    const [currentPageReactElement, setCurrentPageReactElement] = useState(getOtimalOddsComp());
    
    const getEventOddsRequest = () => {
        const markets = betOption === BetOptions.Team ?
            supportedTeamMarketsBySport.get(oddsApiSport) :
            supportedPlayerMarketsBySport.get(oddsApiSport);
        const req: GetEventOddsRequest = {
            eventId: matchup.oddsEvent?.id || '',
            sports: oddsApiSport,
            regions: OddsApiRegions.US,
            markets: markets || [],
            oddsFormat: OddsFormat.American,
            bookmakers: Object.values(Bookmakers)
        } as any;
        return req;
    };

    const [lastDataRefreshDateTime, setLastDataRefreshDateTime] = useState(getCurrentDateEst());
    /********************************************************************************/

    /* effects **********************************************************************/
    useEffect(() => {
        getAndSetEventOddsForBetOption();
        setLastDataRefreshDateTime(getCurrentDateEst());

        const interval = setInterval(() => {
            console.log('Refreshing Event Odds Data...');
            getAndSetEventOddsForBetOption();
            setLastDataRefreshDateTime(getCurrentDateEst());
        }
        , 2 /* min */ *  /* sec */ 60 *  /* milli */ 1000);

        return () => clearInterval(interval);
    }, [betOption]);

    useEffect(() => {
        switch (currentPageIdx) {
            case 1:
                setCurrentPageReactElement(getOtimalOddsComp());
                break;
            case 2:
                setCurrentPageReactElement(getBookmakerLinesComp());
                break;
            default: 
                setCurrentPageReactElement(<div className='empty-comp'></div>);
                break;
        }
    }, [currentEventOdds, selectedPlayerName, currentPageIdx]);
    /********************************************************************************/

    /* services *********************************************************************/
    const getAndSetEventOddsForBetOption = () => {
        setShouldRender(false);
        if (USE_MOCKS) {
            let mockedOdds: any = [];
            if (betOption === BetOptions.Team) {
                mockedOdds = [knicksCavsTeamOdds, grizzliesMagicTeamOdds];        
            } else {
                mockedOdds = [knicksCavsPlayersOdds, grizzliesMagicPlayerOdds];
            }
            const oddsForEvent = mockedOdds.find((respObj: any) => respObj.data.events[0].id === matchup.oddsEvent?.id)!;
            setCurrentEventOdds((oddsForEvent.data || {}) as unknown as GetOddsResponse);
            setShouldRender(true);
        } else {
            getEventOdds(getEventOddsRequest())
                .then((res) => {
                    setCurrentEventOdds(res.data?.data as GetOddsResponse);
                    setShouldRender(true);
                })
                .catch((e) => {
                    console.error(e);
                    setShouldRender(true);
                });
        }
    }
    /********************************************************************************/

    /* event handlers ***************************************************************/
    const handlePaginationChange = (_: ChangeEvent<unknown>, page: number) => {
        setCurrentPageIdx(page);
    }
    /********************************************************************************/

    return (
        <div className='matchup-lines-container'>
             <div className="header-container">
                <h3>Matchup Lines</h3>
                <div className="line"></div>
                <TooltipIcon description={`Odds Data refreshed every 2 min\n\nDK = DraftKings\nFD = FanDuel\nBMGM = BetMGM`} isLightMode={true}/>
            </div>
            <div className="data-refresh-date-time-wrapper">
                {`@${lastDataRefreshDateTime}`}
            </div>
            { shouldRender && currentPageReactElement }
            {
                !shouldRender && 
                    <div className='loader-wrapper'>
                        <l-waveform
                            size="30"
                            stroke="3.25"
                            speed="1" 
                            color="rgb(71 85 105 / 1)" 
                        ></l-waveform>
                    </div>
            }
            <div className="pagination-wrapper">
                <Pagination 
                    count={2} 
                    shape="rounded" 
                    sx={paginationSx}
                    onChange={handlePaginationChange}
                    renderItem={(item) => (
                        <PaginationItem
                          {...item}
                          page={pageLabels[item.page! - 1] || item.page}
                        />
                    )}
                />
            </div>
        </div>
    )
}

export default MatchupLines;