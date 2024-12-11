import { SportsCategories } from '../../../../models/enums/sports-categories';
import { NbaTeamStats } from '../../../../models/nba-team-stats';
import './matchup-team-stats.component.scss';

const MatchupTeamStats: React.FC<{teamStats: NbaTeamStats, sportsCategory: SportsCategories, isHome: boolean}> = ({teamStats, sportsCategory, isHome}) => {
    const getTeamStatsComponentHelper = (label: string, value: string) => {
        return (
          <div className='team-stat'>
            <span className='label'>{label}:</span>
            <span className='value'>{value}</span> 
          </div>
        )
      };
    
      const getTeamStatsComponent = () => {
        switch (sportsCategory) {
          case SportsCategories.NBA: {
            if (isHome) {
              return (
                <div className='team-stats'>
                  {getTeamStatsComponentHelper('T', `${teamStats.totalWins}-${teamStats.totalLosses}`)}
                  {getTeamStatsComponentHelper('H', `${teamStats.homeWins}-${teamStats.homeLosses}`)}
                  {getTeamStatsComponentHelper('L-10', `${teamStats.lastTenTotalWins}-${teamStats.lastTenTotalLosses}`)}
                  {getTeamStatsComponentHelper('Strk', `${teamStats.totalStreak}`)}
                </div>
              );
            }
            return (
              <div className='team-stats'>
                {getTeamStatsComponentHelper('T', `${teamStats.totalWins}-${teamStats.totalLosses}`)}
                {getTeamStatsComponentHelper('A', `${teamStats.awayWins}-${teamStats.awayLosses}`)}
                {getTeamStatsComponentHelper('L-10', `${teamStats.lastTenTotalWins}-${teamStats.lastTenTotalLosses}`)}
                {getTeamStatsComponentHelper('Strk', `${teamStats.totalStreak}`)}
              </div>
            );
          }
          default: return (<div></div>);
        }  
      }
    
    return getTeamStatsComponent();
}

export default MatchupTeamStats