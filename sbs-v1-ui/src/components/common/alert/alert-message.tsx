import { useState } from "react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import "./alert-message.scss";

interface AlertMessageProps {
  message: string;
  type?: "error" | "success" | "info";
  className?: string;
}

const iconMap = {
  error: <AlertTriangle size={20} />,
  success: <CheckCircle size={20} />,
  info: <Info size={20} />,
};

export default function AlertMessage({ message, type = "info", className }: AlertMessageProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className={`alert-message ${type} ${className}`}>
      {iconMap[type]}
      <span className="message-text">{message}</span>
      <button onClick={() => setVisible(false)} className="close-button">
        <X size={16} />
      </button>
    </div>
  );
}
