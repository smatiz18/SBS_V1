import { useEffect, useState } from "react";
import MatchupComponent from "../../../common/matchup/matchup.component";
import "./nba-daily-matchups.scss";
import { getNbaMatchups } from "../../../../services/nba/services";
import { NbaLogoMapper } from "../../../../assets/images/nba-logo-mapper";
import { Matchup } from "../../../../models/matchup";
import { getOdds } from "../../../../services/odds/services";
import { GetOddsRequest } from "../../../../models/services/get-odds-request";
import { OddsApiSports } from "../../../../models/enums/odds-api-sports";
import { OddsApiRegions } from "../../../../models/enums/odds-api-regions";
import { TeamBetTypes } from "../../../../models/enums/team-bet-types";
import { OddsFormat } from "../../../../models/enums/odds-format";
import { Bookmakers } from "../../../../models/enums/bookmakers";
import { Event } from "../../../../models/odds/odds";
import { NbaTeamsMappedByName } from "../../../../constants/nba";
import { format, toZonedTime } from 'date-fns-tz';
import { SportsCategories } from "../../../../models/enums/sports-categories";
import { GetNbaMatchupsMockResonse, GetNbaOddsMockResponse } from "../../../../test/nba-matchups-mocks";
import { GetOddsResponse } from "../../../../models/services/get-odds-response";
import { AxiosResponse } from "axios";

const NbaDailyMatchups = () => {
    const [nbaMatchups, setNbaMatchups] = useState([] as Matchup[]);

    useEffect(() => {
        fetchInitData(false);
      }, []);

    const getDateEst = () => {
      const timeZone = 'America/New_York';
      const date = new Date();
      const zonedDate = toZonedTime(date, timeZone);
      return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone });
    }

    function parseOddsData(getOddsResponse: GetOddsResponse) {
      return getOddsResponse.events.reduce((map: any, event: Event) => {
        const teamNickname = NbaTeamsMappedByName[event.homeTeam]?.teamNickname;
        if (!map[teamNickname]) {
          map[teamNickname] = event;
        } else if (Date.parse(event.commenceTime) < Date.parse(map[teamNickname].commenceTime)) {
          map[teamNickname] = event;
        }
        return map;
      }, {});
    }

    const fetchInitData = async (useMock: boolean) => {
        try {
            const getOddsReq: GetOddsRequest = {
              sports: OddsApiSports.BasketballNba,
              regions: OddsApiRegions.US,
              markets: Object.values(TeamBetTypes),
              oddsFormat: OddsFormat.American,
              bookmakers: Object.values(Bookmakers)
            };
            
            let initOddsResponse: AxiosResponse<GetOddsResponse, any>;
            let matchupsResp;
            if (useMock) {
              initOddsResponse = { data: GetNbaOddsMockResponse } as any;
              matchupsResp = { data: GetNbaMatchupsMockResonse } as any;
            } else {
              initOddsResponse = await getOdds(getOddsReq);
              matchupsResp = await getNbaMatchups();
            }
         
            const oddsEventMappedByHomeTeam = parseOddsData(initOddsResponse.data);
            const enrichedMatchups = matchupsResp.data.matchups.map((matchup: Matchup) => { 
              matchup.sportsCategory = SportsCategories.NBA;
              matchup.away.teamLogo = NbaLogoMapper.get(matchup.away.teamNickname)!;
              matchup.home.teamLogo = NbaLogoMapper.get(matchup.home.teamNickname)!;
              const odds = oddsEventMappedByHomeTeam[matchup.home.teamNickname];              
              if (odds && matchup.away.teamNickname === NbaTeamsMappedByName[odds.awayTeam]?.teamNickname) {
                matchup.away.teamName = odds.awayTeam;
                matchup.home.teamName = odds.homeTeam;
                matchup.odds = odds;
                matchup.optimalOdds = (initOddsResponse.data.optimalOddsMap || {})[odds.id];
              }
              return matchup;
            });
          
            setNbaMatchups(enrichedMatchups); 
          
          } catch (error) {
            console.error(error);
            /** implement later */
          } finally {
            /** implement later */
          }
    }

    return (
        <div className="page-container">
            <div className="header">
                <h1 className="header-title">NBA Matchups</h1>
                <text className="date-time">{`@${getDateEst()} EST`}</text>
            </div>
            <div className="content">
                <div className="main-content">
                  {nbaMatchups.map((nbaMatchup: Matchup) => (
                    <MatchupComponent matchup={nbaMatchup}/>
                  ))}
                </div>
            </div>
            <div className="footer">
            </div>
       </div>
    );
}

export default NbaDailyMatchups;