import { format, toZonedTime } from "date-fns-tz";
import { PlayerBetTypes } from "../models/enums/player-bet-types";
import { TeamBetTypes } from "../models/enums/team-bet-types";
import { GameStats } from "../models/nba-team-agg-game-stats-historical";
import { PlayerStatsObj } from "../models/nba-player-game-stats-historical";

// TODO ensure this gets updated every season
export const CURRENT_NBA_SEASON = 2024;
export const EST_TIMEZONE = 'America/New_York';

export const getBetTypeLabel = (betType: TeamBetTypes | PlayerBetTypes) => {
    switch (betType) {
        case TeamBetTypes.H2H:
            return 'Moneyline';
        case TeamBetTypes.Spreads:
            return 'Spread';
        case TeamBetTypes.Totals:
            return 'Total';
        case PlayerBetTypes.PlayerAssists:
            return 'Assists';
        case PlayerBetTypes.PlayerPoints:
            return 'Points';
        case PlayerBetTypes.PlayerPointsAssists:
            return 'Pts + Ass';
        case PlayerBetTypes.PlayerPointsRebounds:
            return 'Pts + Reb';
        case PlayerBetTypes.PlayerPointsReboundsAssists:
            return 'Pts + Reb + Ass';
        case PlayerBetTypes.PlayerRebounds:
            return 'Rebounds';
        case PlayerBetTypes.PlayerThrees:
            return 'Threes';
        default:
            return betType;
    }
}

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

export const sortNbaPlayerStatsObjs = (stats: PlayerStatsObj[]) => {
    return stats.sort((a, b) => Date.parse(a.dateStart || '') - Date.parse(b.dateStart || ''));
}

export const calculateRollingAverages = (vec: number[], period: number) => {
    let rollingAvgs = [];
    let idx = 0;
    while (idx < vec.length) {
        if (idx - period < 0) {
            rollingAvgs.push(mean(vec.slice(0, idx === 0 ? undefined : idx)));
        } else {
            rollingAvgs.push(mean(vec.slice(idx - period, idx)));
        }
        idx += 1;
    }
    return rollingAvgs;
};

export const calculatedExpandingAverages = (vec: number[]) => {
    let expandingAvgs = [];
    let idx = 0;
    while (idx < vec.length) {
        expandingAvgs.push(mean(vec.slice(0, idx === 0 ? undefined : idx)));
        idx += 1;
    }
    return expandingAvgs;
};

export const getHoursAndMinutesEt = (dateString: string) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };

    const dateStringAsEst = new Intl.DateTimeFormat('en-US', options).format(date);
    if (dateStringAsEst && dateStringAsEst[0] === '0') {
        return dateStringAsEst.slice(1);
    }
    return dateStringAsEst;
};

export const getCurrentDateEst = () => {
    const date = new Date();
    const zonedDate = toZonedTime(date, EST_TIMEZONE);
    return format(zonedDate, "MM/dd/yyyy,  hh:mm a 'EST'", { timeZone: EST_TIMEZONE });
}

export const convertUTCStringToESTString = (utcString: string) => {
    // Parse UTC string to Date object
    const utcDate = new Date(utcString);
  
    // Convert to EST (Eastern Time)
    const estDateString = utcDate.toLocaleString("en-US", {
      timeZone: EST_TIMEZONE,
    });
  
    return estDateString;
};
  