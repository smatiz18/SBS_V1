import { useEffect, useState } from "react";
import MatchupComponent from "../../../../common/matchup/matchup-component";
import "./nba.scss";
import { getNbaMatchups } from "../../../../../services/nba/services";
import { NbaLogoMapper } from "../../../../../assets/images/nba-logo-mapper";
import { Matchup } from "../../../../../models/services/get-nba-matchups-response";

const NBA = () => {
    const [nbaMatchups, setNbaMatchups] = useState([] as any[]);

    useEffect(() => {
        fetchInitData();
      }, []);

    const fetchInitData = async () => {
        try {
            const matchupsResp = await getNbaMatchups();
            matchupsResp.data.matchups.map((matchup: Matchup) => { 
              matchup.away.teamLogo = NbaLogoMapper.get(matchup.away.nickname)!;
              matchup.home.teamLogo = NbaLogoMapper.get(matchup.home.teamLogo)!;
              return matchup;
            });
            setNbaMatchups(matchupsResp.data.matchups); 
          
          } catch (error) {
            /** implement later */
          } finally {
            /** implement later */
          }
    }

    return (
        <div className="page-container">
            <div className="header">
                <h1 className="header-title">NBA Matchups</h1>
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

export default NBA;