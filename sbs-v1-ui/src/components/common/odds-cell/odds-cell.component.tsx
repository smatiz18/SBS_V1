import React from 'react';
import './odds-cell.component.scss';
import { OddsCellParams } from '../../../models/component/odds-cell-params';

const OddsCell: React.FC<{params: OddsCellParams}> = ({params}) => {
  return (
    <div className="odds-cell">
      <span className="odds-label">{params.label}</span>
      <span className="odds-value">{params.odds}</span>
    </div>
  );
};

export default OddsCell;