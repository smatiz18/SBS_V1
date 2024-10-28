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

const NbaDailyMatchups = () => {
    const [nbaMatchups, setNbaMatchups] = useState([] as Matchup[]);

    useEffect(() => {
        fetchInitData();
      }, []);

    const getDateEst = () => {
      const timeZone = 'America/New_York';
      const date = new Date();

      // Convert UTC date to the specified time zone
      const zonedDate = toZonedTime(date, timeZone);

      // Format the date in the specified time zone
      return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone });
    }

    const fetchInitData = async () => {
        try {
            const getOddsReq: GetOddsRequest = {
              sports: OddsApiSports.BasketballNba,
              regions: OddsApiRegions.US,
              markets: Object.values(TeamBetTypes),
              oddsFormat: OddsFormat.American,
              bookmakers: Object.values(Bookmakers)
            };
            const initOddsResponse = await getOdds(getOddsReq);
            const oddsEventMappedByHomeTeam: Record<string, Event> = initOddsResponse.data.reduce((map: any, event: any) => {
              const teamNickname = NbaTeamsMappedByName[event.homeTeam]?.teamNickname;
              map[teamNickname] = event;
              return map;
            }, {});
            
            const matchupsResp = await getNbaMatchups();
            
            const enrichedMatchups = matchupsResp.data.matchups.map((matchup: Matchup) => { 
              matchup.away.teamLogo = NbaLogoMapper.get(matchup.away.teamNickname)!;
              matchup.home.teamLogo = NbaLogoMapper.get(matchup.home.teamNickname)!;
              const odds = oddsEventMappedByHomeTeam[matchup.home.teamNickname];
              // TODO should check on dates to in the case where a team plays the same team 2 days in a row
              if (odds && matchup.away.teamNickname === NbaTeamsMappedByName[odds.awayTeam]?.teamNickname) {
                matchup.odds = odds;
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

    // TODO put this somehwere <p className='instructions'>Click on Team or Player to view Lines & Stats</p>

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