import React, { useState } from 'react';
import './game-overview.scss';

interface Team {
  name: string;
  logo: string;
  lineup: string[];
}

interface BasketballGameProps {
  homeTeam: Team;
  awayTeam: Team;
}

const BasketballGame: React.FC<BasketballGameProps> = ({ homeTeam, awayTeam }) => {
  const [viewStats, setViewStats] = useState(false);

  const toggleStatsView = () => {
    setViewStats(!viewStats);
  };

  return (
    <div className="basketball-game">
      <div className="team-info">
        <div className="team home">
          <img src={homeTeam.logo} alt={`${homeTeam.name} logo`} className="team-logo" />
          <h2 className="team-name">{homeTeam.name} (Home)</h2>
          <ul className="team-lineup">
            {homeTeam.lineup.map(player => (
              <li key={player} className="player">{player}</li>
            ))}
          </ul>
        </div>
        <div className="team away">
          <img src={awayTeam.logo} alt={`${awayTeam.name} logo`} className="team-logo" />
          <h2 className="team-name">{awayTeam.name} (Away)</h2>
          <ul className="team-lineup">
            {awayTeam.lineup.map(player => (
              <li key={player} className="player">{player}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="analytics">
        <button onClick={toggleStatsView} className="stats-button">
          {viewStats ? 'Hide' : 'View'} Analytics & Statistics
        </button>
        {viewStats && (
          <div className="stats-content">
            <h3>Team Analytics</h3>
            <p>Home Team: {homeTeam.name} - Average Points per Game: 102.5</p>
            <p>Away Team: {awayTeam.name} - Average Points per Game: 98.7</p>
            {/* Add more detailed statistics here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default BasketballGame;
