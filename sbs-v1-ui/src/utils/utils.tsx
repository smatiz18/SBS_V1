import { PlayerBetTypes } from "../models/enums/player-bet-types";
import { TeamBetTypes } from "../models/enums/team-bet-types";
import { GameStats } from "../models/nba-team-agg-game-stats-historical";

export const getBetTypeLabel = (betType: TeamBetTypes | PlayerBetTypes) => {
    switch (betType) {
        case TeamBetTypes.H2H:
            return 'Moneyline';
        case TeamBetTypes.Spreads:
            return 'Spread';
        case TeamBetTypes.Totals:
            return 'Total';
        default:
            return betType;
    }
}

export const getCurrentNbaSeason = () => {
    const currDate = new Date().toISOString().split('T')[0];
    if ("2023" < currDate && currDate < "2024") {
        return 2023;
    }
    if ("2024" < currDate && currDate < "2025") {
        return 2024;
    }
    return parseInt(currDate.split("-")[0]);
};

    
export const range = (start: number, end: number): number[] => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const mean = (vec: number[]) => vec.reduceRight((prev: number, curr: number) => prev + curr, 0) / vec.length;
    
export const sliceLast = (vec: number[], slice: number) => {
    if (slice >= vec.length) {
        return vec;
    }

    return vec.slice(vec.length - slice);
} 

export const sliceFirst = (vec: number[], slice: number) => {
    if (slice >= vec.length) {
        return vec;
    }
    return vec.slice(0, slice);
}  

export const stdDeviation = (vec: number[]) => {
    if (vec.length === 0) return 0;
    const mean = vec.reduce((acc, num) => acc + num, 0) / vec.length;
    const squaredDiffs = vec.map(num => Math.pow(num - mean, 2));
    const variance = squaredDiffs.reduce((acc, diff) => acc + diff, 0) / vec.length;
    return Math.sqrt(variance);
}

export const sortGameStatsObjs = (stats: GameStats[]) => {
    return stats.sort((a, b) => Date.parse(a.dateStart) - Date.parse(b.dateStart));
}

export const calculateRollingAverages = (vec: number[], period: number) => {
    let rollingAvgs = [];
    let idx = 0;
    while (idx < vec.length) {
        if (idx - period < 0) {
            rollingAvgs.push(mean(vec.slice(0, idx)));
        } else {
            rollingAvgs.push(mean(vec.slice(idx - period, idx)));
        }
        idx+=1;
    }
    return rollingAvgs;
};

export const calculatgedExpandingAverages = (vec: number[]) => {
    let expandingAvgs = [];
    let idx = 0;
    while (idx < vec.length) {
        expandingAvgs.push(mean(vec.slice(0, idx)));
        idx+=1;
    }
    return expandingAvgs;
};