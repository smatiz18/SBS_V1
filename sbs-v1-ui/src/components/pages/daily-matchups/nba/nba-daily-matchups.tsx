import { useEffect, useState } from 'react';
import MatchupComponent from '../../../common/matchup/matchup.component';
import { getNbaMatchups, getNbaTeamAggGameStats, getNbaTeamStats } from '../../../../services/nba/services';
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
import { GetNbaTeamAggGameStatsRequest } from '../../../../models/services/get-nba-team-agg-game-stats-request';
import { NbaTeamAggGameStatsHistorical } from '../../../../models/nba-team-agg-game-stats-historical';
import _ from 'lodash';
import { oddsEventsMockResp, rotoWireDailyMatchupsMockResp } from '../../../../test/nba-matchups-mocks';
import './nba-daily-matchups.scss';

const NbaDailyMatchups = () => {
  /* consts ***********************************************************************/
  const USE_MOCKS = true;
  const [nbaMatchups, setNbaMatchups] = useState([] as Matchup[]);
  /********************************************************************************/

  /* effects **********************************************************************/
  useEffect(() => {
    fetchInitData(USE_MOCKS /* use mock data */);
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

  /* data fetchers ****************************************************************/
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

      const nbaTeamStatsReq: GetNbaTeamStatsRequest = {
        teamIds: (matchupsResp.data?.data?.data.matchups || []).flatMap((matchup: Matchup) => (
          [
            NbaTeamsMappedByNickname[matchup.away.teamNickname].nbaApiId,
            NbaTeamsMappedByNickname[matchup.home.teamNickname].nbaApiId
          ])
        ),
        season: currentNbaSeason,
        seasonType: SeasonType.All
      };

      const nbaTeamStats = await getNbaTeamStats(nbaTeamStatsReq);
      const nbaTeamStatsMappedByTeamNickname = nbaTeamStats.data
        .reduce((agg: Record<string, NbaTeamStats>, curr: NbaTeamStats) => {
          agg[curr.teamNickname] = curr;
          return agg;
        }, {});

      const nbaTeamAggGameStats = await getNbaTeamAggGameStats(nbaTeamStatsReq as GetNbaTeamAggGameStatsRequest);
      const nbaTeamAggGameStatsMappedByTeamNickname = nbaTeamAggGameStats.data
        .reduce((agg: Record<string, NbaTeamAggGameStatsHistorical>, curr: NbaTeamAggGameStatsHistorical) => {
          agg[curr.teamNickname] = curr;
          return agg;
        }, {});

      const eventMappedByHomeTeam = parseOddsEventsData(oddsEventsResponse.data.data as Event[]);
      const enrichedMatchups = (matchupsResp.data?.data?.data.matchups || []).map((matchup: Matchup) => {
        matchup.sportsCategory = SportsCategories.NBA;

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
    <div className='page-container'>
      <div className='header'>
        <h1 className='header-title'>NBA Matchups</h1>
        <text className='date-time'>{`@${getCurrentDateEst()}`}</text>
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