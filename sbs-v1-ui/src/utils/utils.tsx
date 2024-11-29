import { PlayerBetTypes } from "../models/enums/player-bet-types";
import { TeamBetTypes } from "../models/enums/team-bet-types";

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
