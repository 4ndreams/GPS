import React, { useEffect, useState } from "react";
import "../styles/Notification.css";

interface NotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type = "info", onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 400); // Espera la animación de salida
    }, 3000); // 3 segundos visible
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 400);
  };

  return (
    <div className={`notification ${type} ${visible ? "" : "hide"}`}>
      <span>{message}</span>
      {onClose && (
        <button
          className="close-btn"
          onClick={handleClose}
          tabIndex={0}
          style={{ outline: "none" }}
          onMouseDown={e => e.preventDefault()} // Evita el outline al hacer clic
          >
          &times;
        </button>
      )}
    </div>
  );
};

export default Notification;