import React from 'react';
import './matchup.component.scss';
import { Matchup } from '../../../models/matchup';
import { MatchupLinesAndStats } from '../../../models/matchup-lines-and-stats';
import MatchupTeamStats from './matchup-team-stats/matchup-team-stats.component';
import MatchupLines from './matchup-lines/matchup-lines.component';
import { getHoursAndMinutesEt } from '../../../utils/utils';

const MatchupComponent: React.FC<{ matchup: Matchup }> = ({ matchup }) => {
  return (
    <div className="matchup-component">
      <div className="team-info">
        <div className="team away">
          <img src={matchup.away.teamLogo} alt={`${matchup.away.teamNickname} logo`} className="team-logo" />
          <h2 className="team-nickname">{matchup.away.teamNickname} (Away)</h2>
          <div className='team-stats-wrapper'>
            <MatchupTeamStats teamStats={matchup.away.teamStats} sportsCategory={matchup.sportsCategory} isHome={false} />
          </div>
          <ul className="team-lineup">
            {matchup.away.projectedPlayers.map(player => (
              <li key={player} className="player">{player}</li>
            ))}
          </ul>
        </div>
        <div className='date-start'>
          {`@${getHoursAndMinutesEt(matchup.dateStart)} ET`}
        </div>
        <div className="team home">
          <img src={matchup.home.teamLogo} alt={`${matchup.home.teamNickname} logo`} className="team-logo" />
          <h2 className="team-nickname">{matchup.home.teamNickname} (Home)</h2>
          <div className='team-stats-wrapper'>
            {/* <MatchupTeamStats teamStats={matchup.home.teamStats} sportsCategory={matchup.sportsCategory} isHome={true}/> */}
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
        <div className='lines-and-stats-content'>
          <MatchupLines matchup={{ ...matchup } as MatchupLinesAndStats} />
        </div>
        {/* <div className="lines-and-stats-content">
              <MatchupQuickStats matchup={{...matchup} as MatchupLinesAndStats} betOption={BetOptions.Team}/>
            </div> */}
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default MatchupComponent;
