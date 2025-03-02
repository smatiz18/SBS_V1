import { PlayerStatsObj } from "./nba-player-game-stats-historical";

export interface NbaPlayerAggGameStatsHistorical {
    _id: string;
    playerId: number;
    teamId: number;
    season?: string;
    seasonType?: string;
    firstname?: string;
    lastname?: string;
    birthday?: string;
    countryOfBirth?: string;
    playerStats: Record<string, PlayerStatsObj>; // HashMap<String, PlayerStatsObj> → Record<string, PlayerStatsObj>
  }

  export function getAllNbaPlayerStatsObjsFromAllTeams(
    playerGameStats: NbaPlayerAggGameStatsHistorical[], 
    selectedPlayerName: string
  ): PlayerStatsObj[] {
    const playerStatsAggObj = playerGameStats.filter((obj: NbaPlayerAggGameStatsHistorical) => `${obj.firstname} ${obj.lastname}` === selectedPlayerName);
    const flattenedPLayerStatsObjs = playerStatsAggObj.flatMap((obj: NbaPlayerAggGameStatsHistorical) => {
        return Object.values(obj.playerStats).map((pso: PlayerStatsObj) =>
            ({
                ...pso,
                playerFirstname: obj.firstname,
                playerLastname: obj.lastname,
                playerId: obj.playerId,
                teamId: obj.teamId
            })
        );
    }) || [];

    return flattenedPLayerStatsObjs;
}