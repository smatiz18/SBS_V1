import React from 'react';
import './odds-cell.component.scss';

interface OddsCellProps {
  label: string;
  odds: string;
}

const OddsCell: React.FC<OddsCellProps> = ({ label, odds }) => {
  return (
    <div className="odds-cell">
      <span className="odds-label">{label}</span>
      <span className="odds-value">{odds}</span>
    </div>
  );
};

export default OddsCell;