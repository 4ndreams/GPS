import React from "react";
import "../styles/Notification.css";

interface NotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type = "info", onClose }) => {
  return (
    <div className={`notification ${type}`}>
      <span>{message}</span>
      {onClose && (
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
};

export default Notification;