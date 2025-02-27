import React, { useState } from 'react';
import './matchup.component.scss';
import { Matchup } from '../../../models/matchup';
import { MatchupLinesAndStats } from '../../../models/matchup-lines-and-stats';
import MatchupTeamStats from './matchup-team-stats/matchup-team-stats.component';
import MatchupLines from './matchup-lines/matchup-lines.component';
import { getHoursAndMinutesEt } from '../../../utils/utils';
import MatchupQuickStats from './matchup-quick-stats/matchup-quick-stats.component';
import { BetOptions } from '../../../models/enums/bet-options';
import { FormControl, ListSubheader, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { smallFontSelectSx, toggleButtonSx, toggleGroupSx } from '../../../models/form-styles/styles';

const MatchupComponent: React.FC<{ matchup: Matchup }> = ({ matchup }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(matchup.away.projectedPlayers[0] || '');
  const [betOption, setBetOption] = useState(BetOptions.Team);
  const awayPlayerOptions = matchup.away.projectedPlayers;
  const homePlayerOptions = matchup.home.projectedPlayers;

  /* event handlers ***************************************************************/
  const handleBetOptionsToggleChange = (event: any) => {
    setBetOption(event?.target.value);
  };

  const handleSelectedPlayerChange = (event: SelectChangeEvent) => {
    setSelectedPlayer(event.target.value);
  }
  /********************************************************************************/
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
            <MatchupTeamStats teamStats={matchup.home.teamStats} sportsCategory={matchup.sportsCategory} isHome={true} />
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
      <div className="matchup-lines-and-stats-settings-container">
        <div 
          className={`matchup-lines-and-stats-settings-${betOption === BetOptions.Team ? 'team-view' : 'player-view'}`}
        >
          <div className="toggle-wrapper">
            <ToggleButtonGroup
              value={betOption}
              exclusive
              onChange={handleBetOptionsToggleChange}
              aria-label="text alignment"
              sx={toggleGroupSx}
            >
              <ToggleButton sx={toggleButtonSx} value={BetOptions.Team}>
                Team View
              </ToggleButton>
              <ToggleButton sx={toggleButtonSx} value={BetOptions.Player}>
                Player View
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          {
            betOption === BetOptions.Player &&
            <div className="select-wrapper">
              <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={selectedPlayer}
                  onChange={handleSelectedPlayerChange}
                  sx={smallFontSelectSx}
                >
                  <ListSubheader>Away</ListSubheader>
                  {
                    awayPlayerOptions.map((o) => (
                      <MenuItem value={o}>{o}</MenuItem>
                    ))
                  }
                  <ListSubheader>Home</ListSubheader>
                  {
                    homePlayerOptions.map((o) => (
                      <MenuItem value={o}>{o}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </div>
          }
        </div>
      </div>
      <div className="lines-and-stats">
        <div className='lines-and-stats-content'>
          <MatchupLines matchup={{ ...matchup } as MatchupLinesAndStats} betOption={betOption} selectedPlayerName={selectedPlayer}/>
        </div>
        <div className="lines-and-stats-content">
          <MatchupQuickStats matchup={{ ...matchup } as MatchupLinesAndStats} betOption={betOption} selectedPlayerName={selectedPlayer} />
        </div>
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default MatchupComponent;
