import React from 'react';
import { OddsCellParams } from '../../../../../models/component/odds-cell-params';
import { Bookmakers } from '../../../../../models/enums/bookmakers';
import './odds-cell.component.scss';

const OddsCell: React.FC<{params: OddsCellParams}> = ({params}) => {
  const getBookmakerLabel = (bookmaker: Bookmakers) => {
    switch (bookmaker) {
      case Bookmakers.BetMGM:
        return 'BMGM';
      case Bookmakers.DraftKings:
        return 'DK';
      case Bookmakers.FanDuel:
        return 'FD';
      default: return '-';
    }
  };
  return (
    <div className="odds-cell-wrapper">
      <div className={`odds-cell-${params.bookmaker}`}>
        <span className="odds-label">{params.label}</span>
        <span className="odds-value">{params.odds}</span>
      </div>
      <div className="sportsbook-description">
        <span>{getBookmakerLabel(params.bookmaker!)}</span>
      </div>
    </div>
  );
};

export default OddsCell;