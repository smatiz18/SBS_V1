import React, { useState } from 'react';
import './matchup.component.scss';
import { Matchup } from '../../../models/services/get-nba-matchups-response';

const MatchupComponent: React.FC<{matchup: Matchup}> = ({matchup}) => {
  const [viewStats, setViewStats] = useState(false);

  const toggleStatsView = () => {
    setViewStats(!viewStats);
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
            {matchup.home.projectedPlayers.map(player => (
              <li key={player} className="player">{player}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="analytics">
        <button onClick={toggleStatsView} className="stats-button">
          {viewStats ? 'Hide' : 'View'} Sportsbook Lines & Analysis
        </button>
        {viewStats && (
          <div className="stats-content">
            <h3>Team Analytics</h3>
            <p>LINE: - -</p>
            <p>SPREAD: - -</p>
            <p>O/U: - -</p>
            {/* Add more detailed statistics here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchupComponent;
