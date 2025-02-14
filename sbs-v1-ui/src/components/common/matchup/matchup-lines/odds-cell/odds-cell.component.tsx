import React from 'react';
import { OddsCellParams } from '../../../../../models/component/odds-cell-params';
import './odds-cell.component.scss';

const OddsCell: React.FC<{params: OddsCellParams}> = ({params}) => {
  return (
    <div className={`odds-cell-${params.bookmaker}`}>
      <span className="odds-label">{params.label}</span>
      <span className="odds-value">{params.odds}</span>
    </div>
  );
};

export default OddsCell;