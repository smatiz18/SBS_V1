import { useEffect, useState } from "react";
import BasketballGame from "../../../common/matchup/matchup-component";
import "./nba.scss";
import { getNbaMatchups } from "../../../../services/nba/services";

const NBA = () => {
    const [nbaMatchups, setNbaMatchups] = useState([] as any[]);

    useEffect(() => {
        fetchInitData();
      }, []);

    const fetchInitData = async () => {
        try {
            const matchupsResp = await getNbaMatchups();
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
                  {nbaMatchups.map(nbaMatchup => (
                    <BasketballGame away={nbaMatchup.away} home={nbaMatchup.home} sportsBookLines={{} as any}/>
                  ))}
                </div>
            </div>
            <div className="footer">
            </div>
       </div>
    );
}

export default NBA;