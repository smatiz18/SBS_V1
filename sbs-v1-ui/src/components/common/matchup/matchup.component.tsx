import React, { useEffect, useState } from 'react';
import { Matchup } from '../../../models/matchup';
import { MatchupLinesAndStats } from '../../../models/matchup-lines-and-stats';
import MatchupTeamStats from './matchup-team-stats/matchup-team-stats.component';
import MatchupLines from './matchup-lines/matchup-lines.component';
import { getHoursAndMinutesEt, sliceLast, sortNbaPlayerStatsObjs } from '../../../utils/utils';
import MatchupQuickStats from './matchup-quick-stats/matchup-quick-stats.component';
import { BetOptions } from '../../../models/enums/bet-options';
import { FormControl, ListSubheader, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { smallFontSelectSx, toggleButtonSx, toggleGroupSx } from '../../../models/form-styles/styles';
import { NbaPlayerAggGameStatsHistorical } from '../../../models/nba-player-agg-game-stats-historical';
import { SportsCategories } from '../../../models/enums/sports-categories';
import { PlayerStatsObj } from '../../../models/nba-player-game-stats-historical';
import TooltipIcon from '../tooltip/tooltip-icon';
import './matchup.component.scss';

const MatchupComponent: React.FC<{ matchup: Matchup }> = ({ matchup }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(matchup.away.projectedPlayers[0] || '');
  const [betOption, setBetOption] = useState(BetOptions.Team);
  const [awayPlayerOptions, setAwayPlayerOptions] = useState(matchup.away.projectedPlayers);
  const [homePlayerOptions, setHomePlayerOptions] = useState(matchup.home.projectedPlayers);

  /* effects **********************************************************************/
  useEffect(() => {
    setAwayPlayerOptions(matchup.away.projectedPlayers);
    setHomePlayerOptions(matchup.home.projectedPlayers);
  },[matchup]);
  /********************************************************************************/
  /* event handlers ***************************************************************/
  const handleBetOptionsToggleChange = (event: any) => {
    setBetOption(event?.target.value);
  };

  const handleSelectedPlayerChange = (event: SelectChangeEvent) => {
    setSelectedPlayer(event.target.value);
  }

  const getStreakEmojiForNbaPlayerStats = (stats?: NbaPlayerAggGameStatsHistorical) => {
    let emoji = '😐';
    if (stats) {
      if (matchup.sportsCategory === SportsCategories.NBA) {
        const sortedStats: PlayerStatsObj[] = sortNbaPlayerStatsObjs(Object.values(stats.playerStats));
        const points = sortedStats.map((stats: PlayerStatsObj) => stats.points || 0);
        const assists = sortedStats.map((stats: PlayerStatsObj) => stats.assists || 0);
        const reb = sortedStats.map((stats: PlayerStatsObj) => stats.totReb || 0);
        const threes = sortedStats.map((stats: PlayerStatsObj) => stats.tpm || 0);
        const blks = sortedStats.map((stats: PlayerStatsObj) => stats.blocks || 0);
        const stls = sortedStats.map((stats: PlayerStatsObj) => stats.steals || 0);
  
        const sum_vec = points.map((point: number, idx: number) => point + assists[idx] + reb[idx] + threes[idx] + blks[idx] + stls[idx]);
        const ten_game_sum_avg = sliceLast(sum_vec, 10);
        const three_game_sum_avg = sliceLast(sum_vec, 3);
        if (three_game_sum_avg > ten_game_sum_avg) {
          emoji = '🔥';
        } else {
          emoji = '🧊';
        }
      }
    }
    return emoji;
  };

  const getPlayerLineup = (isHome: boolean) => {
    if (matchup.sportsCategory === SportsCategories.NBA) {
      return ((isHome ? matchup.home.projectedPlayers : matchup.away.projectedPlayers) || []).map(player => {
        const stats = matchup.playerAggGameStats.find((playerStats: NbaPlayerAggGameStatsHistorical) => (
          `${playerStats.firstname} ${playerStats.lastname}` === player
        ));
        let emoji = getStreakEmojiForNbaPlayerStats(stats);
        return <li key={player} className="player">{`${player} ${emoji}`}</li>;
      })
    }
    return [];
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
            {getPlayerLineup(/* isHome */ false)}
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
            {getPlayerLineup(/* isHome */true)}
          </ul>
        </div>
      </div>
      <TooltipIcon description={`${'🔥'} = 3 game stats avg > 10 game stats avg\n${'🧊'} = 3 game stats avg < 10 game stats avg\n${'😐'} = player data unavailable`} isLightMode={true}/>
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
