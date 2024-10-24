// Define the TypeScript interface based on the Rust struct
export interface NbaBacktestTeamFeatures {
    win: number;
    predictorTeamId: number;
    teamsVisitorsId: number;
    teamsHomeId: number;
    dateStart: Date;
  
    // Actual Scores
    linescoreQ1: number;
    linescoreQ2: number;
    linescoreQ3: number;
    linescoreQ4: number;
  
    // Expanding Averages
    expandingAvgLinescoreQ1: number;
    expandingAvgLinescoreQ2: number;
    expandingAvgLinescoreQ3: number;
    expandingAvgLinescoreQ4: number;
  
    // 5-Day Moving Averages
    rollingAvg5LinescoreQ1: number;
    rollingAvg5LinescoreQ2: number;
    rollingAvg5LinescoreQ3: number;
    rollingAvg5LinescoreQ4: number;
  
    // 10-Day Moving Averages
    rollingAvg10LinescoreQ1: number;
    rollingAvg10LinescoreQ2: number;
    rollingAvg10LinescoreQ3: number;
    rollingAvg10LinescoreQ4: number;
}