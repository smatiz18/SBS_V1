import React, { useState } from 'react';
import './matchup.component.scss';
import { Matchup } from '../../../models/matchup';
import MatchupLinesAndStatsComponent from './matchup-lines-and-stats.component';
import { MatchupLinesAndStats } from '../../../models/matchup-lines-and-stats';

const MatchupComponent: React.FC<{matchup: Matchup}> = ({matchup}) => {
  return (
    <div className="matchup-component">
      <div className="team-info">
        <div className="team away">
          <img src={matchup.away.teamLogo} alt={`${matchup.away.teamNickname} logo`} className="team-logo" />
          <h2 className="team-nickname">{matchup.away.teamNickname} (Away)</h2>
          <ul className="team-lineup">
            {matchup.away.projectedPlayers.map(player => (
              <li key={player} className="player">{player}</li>
            ))}
          </ul>
        </div>
        <div className="team home">
          <img src={matchup.home.teamLogo} alt={`${matchup.home.teamNickname} logo`} className="team-logo" />
          <h2 className="team-nickname">{matchup.home.teamNickname} (Home)</h2>
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
            <MatchupLinesAndStatsComponent matchup={{...matchup} as MatchupLinesAndStats}/>
          </div>
      </div>
    </div>
  );
};

export default MatchupComponent;
