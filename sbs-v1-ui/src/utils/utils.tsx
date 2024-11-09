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