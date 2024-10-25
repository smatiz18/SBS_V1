import React, { useState } from 'react';
import './matchup.component.scss';
import { Matchup, SportsbookLines } from '../../../models/services/get-nba-matchups-response';

const MatchupComponent: React.FC<{matchup: Matchup}> = ({matchup}) => {
  const [viewStats, setViewStats] = useState(false);

  const toggleStatsView = () => {
    setViewStats(!viewStats);
  };

  /* set this as a viewing option */
  const getSportsbookLinesHtml = (lines: SportsbookLines) => {
    const teamNickname = lines.teamNickname;
    delete lines.teamNickname;
    return (
      <div className='sportsbook-lines-div'>
        {/* {`${teamNickname} lines`} */}
        {
          Object.entries(lines).map((betTypes: any[]) => (
            <div className='bet-types-div'>
            <b>{betTypes[0] === 'OU' ? 'O/U' : betTypes[0] || 'NA'}</b>
            {
              Object.entries(betTypes[1]).map((odds: any[]) => (
                <p>{`${odds[0]}: ${odds[1]}`}</p>
              ))
            }
            </div>
          ))
        }
      </div>
    );
  };

  return (
    <div className="matchup-component">
      <div className="team-info">
        <div className="team away">
          <img src={matchup.away.teamLogo} alt={`${matchup.away.nickname} logo`} className="team-logo" />
          <h2 className="team-nickname">{matchup.away.nickname} (Away)</h2>
          <ul className="team-lineup">
            {matchup.away.projectedPlayers.map(player => (
              <li key={player} className="player">{player}</li>
            ))}
          </ul>
        </div>
        <div className="team home">
          <img src={matchup.home.teamLogo} alt={`${matchup.home.nickname} logo`} className="team-logo" />
          <h2 className="team-nickname">{matchup.home.nickname} (Home)</h2>
          <ul className="team-lineup">
            {
              matchup.home.projectedPlayers.map(player => (
                <li key={player} className="player">{player}</li>
              ))
            }
          </ul>
        </div>
      </div>
      <div className="lines-and-stats">
        <p className='instructions'>Click on Team or Player to view Lines & Stats</p>
        {  viewStats && 
          <div className="lines-and-stats-content">
            
            {/* set this as a viewing option */
             /* <h3>Sportsbook Lines</h3>
            { matchup.sportsbookLines && getSportsbookLinesHtml(matchup.sportsbookLines) } */}
          </div>
        }
      </div>
    </div>
  );
};

export default MatchupComponent;
