import { useEffect, useState } from "react";
import MatchupComponent from "../../../common/matchup/matchup.component";
import "./nba-daily-matchups.scss";
import { getNbaMatchups } from "../../../../services/nba/services";
import { NbaLogoMapper } from "../../../../assets/images/nba-logo-mapper";
import { Matchup } from "../../../../models/services/get-nba-matchups-response";
import moment from "moment-timezone";

const NbaDailyMatchups = () => {
    const [nbaMatchups, setNbaMatchups] = useState([] as any[]);

    useEffect(() => {
        fetchInitData();
      }, []);

    const fetchInitData = async () => {
        try {
            const matchupsResp = await getNbaMatchups();
            console.log(matchupsResp);
            const sportsbookLines = matchupsResp.data.sportsbookLines;
            const enrichedMatchups = matchupsResp.data.matchups.map((matchup: Matchup) => { 
              matchup.away.teamLogo = NbaLogoMapper.get(matchup.away.nickname)!;
              matchup.home.teamLogo = NbaLogoMapper.get(matchup.home.nickname)!;
              matchup.sportsbookLines = sportsbookLines[matchup.home.nickname] || sportsbookLines[matchup.away.nickname];
              if (matchup.sportsbookLines) {
                matchup.sportsbookLines.teamNickname = sportsbookLines[matchup.home.nickname] ? matchup.home.nickname : matchup.away.nickname;
              }
              return matchup;
            });
            console.log(nbaMatchups);
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
                <text className="date-time">{`@${moment().tz("America/New_York").format()}`}</text>
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