import React, { useState } from "react";
import { Info } from "lucide-react";
import "./tooltip-icon.scss";

interface TooltipIconProps {
  description: string;
  customIcon?: string;
  isLightMode?: boolean;
}

const TooltipIcon: React.FC<TooltipIconProps> = ({ description, customIcon, isLightMode = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Function to format text: preserves tabs and only breaks at \n
  const formatText = (text: string) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line.replace(/\t/g, "\u00A0\u00A0\u00A0\u00A0")}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div 
      className={`tooltip-container ${isLightMode ? "light-mode" : "dark-mode"}`} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip Icon */}
      <div className="tooltip-icon">
        {customIcon ? (
          <span className="custom-char">{customIcon}</span>
        ) : (
          <Info size={16} />
        )}
      </div>

      {/* Tooltip Text */}
      {isHovered && (
        <div className="tooltip-text">
          {formatText(description)}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default TooltipIcon;
