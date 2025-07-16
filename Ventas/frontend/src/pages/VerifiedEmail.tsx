import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "@services/authService";
import "@styles/VerifiedEmail.css";

const VerifiedEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState<string>("Verificando...");
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay parámetro success, redirige al 404
    if (!searchParams.get("success")) {
      navigate("/404", { replace: true });
      return;
    }

    const success = searchParams.get("success");
    const msg = searchParams.get("message");

    if (success === "true") {
      setStatus("success");
      setMessage("¡Correo verificado exitosamente!");
    } else if (success === "false") {
      setStatus("error");
      setMessage(msg || "Error al verificar el correo.");
    } else {
      setStatus("pending");
      setMessage("Verificando...");
    }
  }, [searchParams, navigate]);

  const handleGoHome = () => {
    window.location.href = "/";
  };


  return (
    <div className="verified-bg">
      <div className="verified-card">
        <div className="verified-icon">
          {status === "success" && (
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#fae0e0" />
              <path
                d="M7 13l3 3 7-7"
                stroke="#2ecc40" // Verde para el check
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {status === "error" && (
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#fae0e0" />
              <path
                d="M8 8l8 8M16 8l-8 8"
                stroke="#EC221F" // Rojo para la X
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {status === "pending" && (
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#fae0e0" />
              <path
                d="M7 13l3 3 7-7"
                stroke="#aaa"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <h2 style={{ color: status === "success" ? "#2ecc40" : status === "error" ? "#EC221F" : "#000" }}>
          {status === "pending"
            ? "Verificando..."
            : status === "success"
            ? "¡Correo verificado!"
            : "Error"}
        </h2>
        <p style={{ color: "#000" }}>
          {message}
        </p>
        <button className="verified-btn" onClick={handleGoHome}>
          Ir al inicio
        </button>
      </div>
    </div>
  );
};

export default VerifiedEmail;