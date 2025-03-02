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
import './matchup-lines.component.scss';

const MatchupLines: React.FC<{
    matchup: MatchupLinesAndStats, 
    betOption: BetOptions, 
    selectedPlayerName: string}> = ({matchup, betOption, selectedPlayerName}) => {  
    /* consts ***********************************************************************/
    const USE_MOCKS = false;
    const pageLabels = ['Bookmaker Lines', 'Optimal Odds'];
    const oddsApiSport = sportsKeyToOddsApiSports.get(matchup.oddsEvent?.sportKey || '') as OddsApiSports || null;
    
    const getBookmakerLinesComp = () => (
        currentEventOdds.events[0] && 
        <MatchupBookmakerLines 
            matchup={{...matchup}} 
            betOption={betOption}
            eventOdds={currentEventOdds.events[0]}
            oddsApiSport={oddsApiSport}
            selectedPlayerName={selectedPlayerName}
        />
    );
    const getOtimalOddsComp = () => {
        return currentEventOdds.teamOptimalOddsMap![matchup.oddsEvent?.id || ''] && 
        <MatchupOptimalOdds 
            matchup={{ ...matchup }} 
            betOption={betOption} 
            teamOptimalOdds={betOption === BetOptions.Team ? currentEventOdds.teamOptimalOddsMap![matchup.oddsEvent?.id || ''] : undefined }
            playerOptimalOdds={betOption === BetOptions.Player ? currentEventOdds.playerOptimalOddsMap![matchup.oddsEvent?.id || '']: undefined}
            oddsApiSport={oddsApiSport}
            selectedPlayerName={selectedPlayerName} 
        />
    };
    const [currentEventOdds, setCurrentEventOdds] = useState({ events: [], teamOptimalOddsMap: {}, playerOptimalOddsMap: {} } as GetOddsResponse);
    const [bookmakerLinesComp, setBookmakerLinesComp] = useState(getBookmakerLinesComp());
    const [optimalOddsComp, setOptimalOddsComp] = useState(getOtimalOddsComp());

    const pageToCompMap: Record<string, ReactElement> = {
        '1': bookmakerLinesComp,
        '2': optimalOddsComp
    };

    const [currentPage, setCurrentPage] = useState(1);
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

        const interval = setInterval(() => {
            console.log('Refreshing Event Odds Data...');
            getAndSetEventOddsForBetOption();
            setLastDataRefreshDateTime(getCurrentDateEst());
        }
        , 2 /* min */ *  /* sec */ 60 *  /* milli */ 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        getAndSetEventOddsForBetOption();
    }, [betOption]);

    useEffect(() => {
        setBookmakerLinesComp(getBookmakerLinesComp());
        setOptimalOddsComp(getOtimalOddsComp());
    }, [currentEventOdds, selectedPlayerName]);
    /********************************************************************************/

    /* services *********************************************************************/
    const getAndSetEventOddsForBetOption = () => {
        if (USE_MOCKS) {
            let mockedOdds: any = [];
            if (betOption === BetOptions.Team) {
                mockedOdds = [knicksCavsTeamOdds, grizzliesMagicTeamOdds];        
            } else {
                mockedOdds = [knicksCavsPlayersOdds, grizzliesMagicPlayerOdds];
            }
            const oddsForEvent = mockedOdds.find((respObj: any) => respObj.data.events[0].id === matchup.oddsEvent?.id)!;
            setCurrentEventOdds((oddsForEvent.data || {}) as unknown as GetOddsResponse);
        } else {
            getEventOdds(getEventOddsRequest())
                .then((res) => {
                    setCurrentEventOdds(res.data?.data as GetOddsResponse);
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    }
    /********************************************************************************/

    /* event handlers ***************************************************************/
    const handlePaginationChange = (_: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
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
                {lastDataRefreshDateTime}
            </div>
            {pageToCompMap[currentPage.toString()] || <div className='empty-comp'></div>}
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