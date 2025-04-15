export interface NbaPlayerGameStatsHistorical {
    _id: string;
    teamsHomePlayers: Map<number, PlayerStatsObj>;
    teamsVisitorsPlayers: Map<number, PlayerStatsObj>;
    teamsHomeId: number;
    teamsVisitorsId: number;
    season: number;
    dateStart: Date;
  }
  
  export interface PlayerStatsObj {
    points?: number;
    pos?: string;
    min?: number;
    fgm?: number;
    fga?: number;
    fgp?: number;
    ftm?: number;
    fta?: number;
    ftp?: number;
    tpm?: number;
    tpa?: number;
    tpp?: number;
    offReb?: number;
    defReb?: number;
    totReb?: number;
    assists?: number;
    pFouls?: number;
    steals?: number;
    turnovers?: number;
    blocks?: number;
    plusMinus?: number;
    playerId?: number;
    playerFirstname?: string;
    playerLastname?: string;
    teamId?: number;
    gameId?: number;
    dateStart?: string;
    opponentTeamId?: number;
    win: boolean;
    isHome: boolean;
  }