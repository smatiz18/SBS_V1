import React from 'react';
import './matchup.component.scss';
import { Matchup } from '../../../models/matchup';
import { MatchupLinesAndStats } from '../../../models/matchup-lines-and-stats';
import MatchupBookmakerLines from './matchup-bookmaker-lines.component';
import MatchupOptimalOdds from './matchup-optimal-odds.component';
import MatchupQuickStats from './matchup-quick-stats/matchup-quick-stats.component';
import MatchupTeamStats from './matchup-team-stats.component';

const MatchupComponent: React.FC<{matchup: Matchup}> = ({matchup}) => {
  const getHoursAndMinutesEtc = (dateString: string) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };


    const dateStringAsEst = new Intl.DateTimeFormat('en-US', options).format(date);
    if (dateStringAsEst && dateStringAsEst[0] === '0') {
      return dateStringAsEst.slice(1);
    }
    return dateStringAsEst;
  };

  return (
    <div className="matchup-component">
      <div className="team-info">
        <div className="team away">
          <img src={matchup.away.teamLogo} alt={`${matchup.away.teamNickname} logo`} className="team-logo" /> 
          <h2 className="team-nickname">{matchup.away.teamNickname} (Away)</h2>
          <div className='team-stats-wrapper'>
            <MatchupTeamStats teamStats={matchup.away.teamStats} sportsCategory={matchup.sportsCategory} isHome={false}/>
          </div>
          <ul className="team-lineup">
            {matchup.away.projectedPlayers.map(player => (
              <li key={player} className="player">{player}</li>
            ))}
          </ul>
        </div>
        <div className='date-start'>
          {`@${getHoursAndMinutesEtc(matchup.dateStart)} EST`}
        </div>
        <div className="team home">
          <img src={matchup.home.teamLogo} alt={`${matchup.home.teamNickname} logo`} className="team-logo" />  
          <h2 className="team-nickname">{matchup.home.teamNickname} (Home)</h2>
          <div className='team-stats-wrapper'>
            <MatchupTeamStats teamStats={matchup.home.teamStats} sportsCategory={matchup.sportsCategory} isHome={true}/>
          </div>
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
          <div className="lines-and-stats-content">
            <MatchupBookmakerLines matchup={{...matchup} as MatchupLinesAndStats}/>
          </div>
          <div className="lines-and-stats-content">
            <MatchupQuickStats matchup={{...matchup} as MatchupLinesAndStats}/>
          </div>
          <div className="lines-and-stats-content">
            <MatchupOptimalOdds matchup={{...matchup} as MatchupLinesAndStats}/>
          </div>
      </div>
      <div className="footer"></div>
    </div>
  );
};



export default MatchupComponent;
