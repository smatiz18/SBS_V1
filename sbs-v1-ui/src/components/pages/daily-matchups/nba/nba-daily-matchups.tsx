import { useEffect, useState } from 'react';
import MatchupComponent from '../../../common/matchup/matchup.component';
import { getNbaMatchups, getNbaPlayerStatsByNameAndSeason, getNbaTeamAggGameStats, getNbaTeamStats } from '../../../../services/nba/services';
import { NbaLogoMapper } from '../../../../assets/images/nba-logo-mapper';
import { Matchup } from '../../../../models/matchup';
import { getEvents } from '../../../../services/odds/services';
import { OddsApiSports } from '../../../../models/enums/odds-api-sports';
import { Event } from '../../../../models/odds/odds';
import { NbaTeamsMappedByName, NbaTeamsMappedByNickname } from '../../../../constants/nba';
import { SportsCategories } from '../../../../models/enums/sports-categories';
import { NbaTeamStats } from '../../../../models/nba-team-stats';
import { GetNbaTeamStatsRequest } from '../../../../models/services/get-nba-team-stats-request';
import { SeasonType } from '../../../../models/enums/season-type';
import { currentNbaSeason, getCurrentDateEst } from '../../../../utils/utils';
import { NbaTeamAggGameStatsHistorical } from '../../../../models/nba-team-agg-game-stats-historical';
import { oddsEventsMockResp, rotoWireDailyMatchupsMockResp } from '../../../../test/nba-matchups-mocks';
import { GetNbaPlayerStatsByNameAndSeasonRequest, Name } from '../../../../models/services/get-nba-player-stats-by-name-and-season-request';
import { NbaPlayerAggGameStatsHistorical } from '../../../../models/nba-player-agg-game-stats-historical';
import _ from 'lodash';
import './nba-daily-matchups.scss';
import TooltipIcon from '../../../common/tooltip/tooltip-icon';

const NbaDailyMatchups = () => {
  /* consts ***********************************************************************/
  const USE_MOCKS = false;
  const [nbaMatchups, setNbaMatchups] = useState([] as Matchup[]);
  const [lastDataRefreshDate, setLastDataRefreshDate]= useState(getCurrentDateEst());
  /********************************************************************************/

  /* effects **********************************************************************/
  useEffect(() => {
    fetchInitData(USE_MOCKS /* use mock data */);

    const interval = setInterval(() => {
      console.log('Refreshing Data...');
      fetchInitData(USE_MOCKS /* use mock data */);
      setLastDataRefreshDate(getCurrentDateEst());
    }, 15 /* min */ * 60 /* sec */ * 1000 /* ms */);

    return () => clearInterval(interval);
  }, []);
  /********************************************************************************/

  /* data parsers *****************************************************************/
  function parseOddsEventsData(events: Event[]) {
    return events.reduce((map: any, event: Event) => {
      const teamNickname = NbaTeamsMappedByName[event.homeTeam]?.teamNickname;
      if (!map[teamNickname]) {
        map[teamNickname] = event;
      } else if (Date.parse(event.commenceTime) < Date.parse(map[teamNickname].commenceTime)) {
        map[teamNickname] = event;
      }
      return map;
    }, {});
  }
  /********************************************************************************/

  /* helpers **********************************************************************/
  const aggregateAllProjectedPlayersFromMatchups = (matchups: Matchup[]) => {
    const names: Name[] = matchups.flatMap((matchup: Matchup) => {
      return (matchup.away.projectedPlayers || []).concat(matchup.home.projectedPlayers || [])
        .map((name: string) => ({ firstname: name.split(' ')[0], lastname: name.split(' ')[1] }))
    });
    return names;
  }
  /********************************************************************************/

  /* data fetchers ****************************************************************/
  const getNbaPlayerAggStatsHelper = async (matchups: Matchup[]) => {
    const nbaPlayerStatsReq: GetNbaPlayerStatsByNameAndSeasonRequest = {
      names: aggregateAllProjectedPlayersFromMatchups(matchups),
      season: currentNbaSeason,
      seasonType: SeasonType.All
    };
    const nbaPlayerStatsResp = await getNbaPlayerStatsByNameAndSeason(nbaPlayerStatsReq);
    const nbaPlayerStats: NbaPlayerAggGameStatsHistorical[] = nbaPlayerStatsResp.data;
    const nbaPlayerStatsReqMappedByHomeTeam = matchups
      .reduce((agg: Record<string, NbaPlayerAggGameStatsHistorical[]>, curr: Matchup) => {

        const playerSet = new Set((curr.home.projectedPlayers || [] as string[])
          .concat(curr.away.projectedPlayers || [] as string[]));

        nbaPlayerStats.forEach((playerStats: NbaPlayerAggGameStatsHistorical) => {
          if (playerSet.has(`${playerStats.firstname} ${playerStats.lastname}`)) {
            if (agg[curr.home.teamName] && agg[curr.home.teamName].length > 0) {
              agg[curr.home.teamName] = agg[curr.home.teamName].concat([playerStats]);
            } else {
              agg[curr.home.teamName] = [playerStats];
            }
          }
        });

        return agg;
      }, {});
    return nbaPlayerStatsReqMappedByHomeTeam;
  }

  const getNbaTeamStatsReq = (matchups: Matchup[]) => {
    return {
      teamIds: matchups.flatMap((matchup: Matchup) => (
        [
          NbaTeamsMappedByNickname[matchup.away.teamNickname].nbaApiId,
          NbaTeamsMappedByNickname[matchup.home.teamNickname].nbaApiId
        ])
      ),
      season: currentNbaSeason,
      seasonType: SeasonType.All
    } as GetNbaTeamStatsRequest;
  }

  const getNbaTeamStatsHelper = async (matchups: Matchup[]) => {
    const nbaTeamStats = await getNbaTeamStats(getNbaTeamStatsReq(matchups) as any);
    const nbaTeamStatsMappedByTeamNickname = nbaTeamStats.data
      .reduce((agg: Record<string, NbaTeamStats>, curr: NbaTeamStats) => {
        agg[curr.teamNickname] = curr;
        return agg;
      }, {});
    return nbaTeamStatsMappedByTeamNickname;
  }
  const getNbaTeamAggGameStatsHelper = async (matchups: Matchup[]) => {
    const nbaTeamAggGameStats = await getNbaTeamAggGameStats(getNbaTeamStatsReq(matchups) as any);
    const nbaTeamAggGameStatsMappedByTeamNickname = nbaTeamAggGameStats.data
      .reduce((agg: Record<string, NbaTeamAggGameStatsHistorical>, curr: NbaTeamAggGameStatsHistorical) => {
        agg[curr.teamNickname] = curr;
        return agg;
      }, {});
    return nbaTeamAggGameStatsMappedByTeamNickname;
  }

  const fetchInitData = async (useMock: boolean) => {
    try {
      let oddsEventsResponse: any;
      let matchupsResp: any;
      if (useMock) {
        oddsEventsResponse = { data: oddsEventsMockResp };
        matchupsResp = { data: rotoWireDailyMatchupsMockResp };
      } else {
        oddsEventsResponse = await getEvents({ sports: OddsApiSports.BasketballNba });
        matchupsResp = await getNbaMatchups();
      }
      _.set(matchupsResp, 'data.data.data', JSON.parse(matchupsResp.data?.data?.data || ''));

      if (useMock) {
        const filteredMatchups = (matchupsResp.data?.data?.data?.matchups || []).filter((m: any) =>
          m.away.teamNickname === 'Knicks' || m.away.teamNickname === 'Grizzlies'
        );
        _.set(matchupsResp, 'data.data.data.matchups', filteredMatchups);
      }

      const matchups = matchupsResp.data?.data?.data.matchups || [] as Matchup[];

      /* player aggregated stats */
      const nbaPlayerStatsReqMappedByHomeTeam = await getNbaPlayerAggStatsHelper(matchups);

      /* team aggregated stats ***/
      const nbaTeamStatsMappedByTeamNickname = await getNbaTeamStatsHelper(matchups);
      const nbaTeamAggGameStatsMappedByTeamNickname = await getNbaTeamAggGameStatsHelper(matchups);

      const eventMappedByHomeTeam = parseOddsEventsData(oddsEventsResponse.data.data as Event[]);
      const enrichedMatchups = matchups.map((matchup: Matchup) => {
        matchup.sportsCategory = SportsCategories.NBA;
        matchup.playerAggGameStats = nbaPlayerStatsReqMappedByHomeTeam[matchup.home.teamName];
        matchup.away.teamLogo = NbaLogoMapper.get(matchup.away.teamNickname)!;
        matchup.away.teamStats = nbaTeamStatsMappedByTeamNickname[matchup.away.teamNickname];
        matchup.away.teamAggGameStats = nbaTeamAggGameStatsMappedByTeamNickname[matchup.away.teamNickname];

        matchup.home.teamLogo = NbaLogoMapper.get(matchup.home.teamNickname)!;
        matchup.home.teamStats = nbaTeamStatsMappedByTeamNickname[matchup.home.teamNickname];
        matchup.home.teamAggGameStats = nbaTeamAggGameStatsMappedByTeamNickname[matchup.home.teamNickname];

        const oddsEvent = eventMappedByHomeTeam[matchup.home.teamNickname];
        if (oddsEvent && matchup.away.teamNickname === NbaTeamsMappedByName[oddsEvent.awayTeam]?.teamNickname) {
          matchup.away.teamName = oddsEvent.awayTeam;
          matchup.home.teamName = oddsEvent.homeTeam;
          matchup.oddsEvent = oddsEvent;
          matchup.dateStart = oddsEvent.commenceTime;
        }
        return matchup;
      })
        .filter((m: Matchup) => m.dateStart !== undefined);

      setNbaMatchups(enrichedMatchups);
    } catch (error) {
      console.error(error);
      /** implement later */
    } finally {
      /** implement later */
    }
  }
  /********************************************************************************/

  return (
    <div className='daily-matchups-container'>
      <div className='header'>
        <h1 className='header-title'>NBA Matchups</h1>
        <div className='date-time-wrapper'>
          {`@${lastDataRefreshDate}`}
          <div className='tooltip-icon-wrapper'>
            <TooltipIcon description='All non odds data is refreshed every 15 min' isLightMode={true}/>
          </div>
        </div>
      </div>
      <div className='content'>
        <div className='main-content'>
          {
            nbaMatchups.map((nbaMatchup: Matchup) => (
              <MatchupComponent matchup={nbaMatchup} />
            ))
          }
        </div>
      </div>
      <div className='footer'>
      </div>
    </div>
  );
}
export default NbaDailyMatchups;