export interface GetNbaLiveScoresResponse {
    get: string;
    parameters: Parameters;
    errors: string[];
    results: number;
    response: Game[];
  }
  
  export interface Parameters {
    live: string;
  }
  
  export interface Game {
    id: number;
    league: string;
    season: number;
    date: GameDate;
    stage: number;
    status: Status;
    periods: Periods;
    arena: Arena;
    teams: Teams;
    scores: Scores;
    officials: string[];
    timesTied?: number;
    leadChanges?: number;
    nugget?: string;
  }
  
  export interface GameDate {
    start: string;
    end?: string;
    duration?: string;
  }
  
  export interface Status {
    clock: string;
    halftime: boolean;
    short: number;
    long: string;
  }
  
  export interface Periods {
    current: number;
    total: number;
    endOfPeriod: boolean;
  }
  
  export interface Arena {
    name: string;
    city: string;
    state: string;
    country?: string;
  }
  
  export interface Teams {
    visitors: Team;
    home: Team;
  }
  
  export interface Team {
    id: number;
    name: string;
    nickname: string;
    code: string;
    logo: string;
  }
  
  export interface Scores {
    visitors: Score;
    home: Score;
  }
  
  export interface Score {
    win: number;
    loss: number;
    series: Series;
    linescore: string[];
    points: number;
  }
  
  export interface Series {
    win: number;
    loss: number;
  }
  