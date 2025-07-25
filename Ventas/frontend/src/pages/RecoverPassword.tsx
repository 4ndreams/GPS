import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "@styles/Login.css";
import "@styles/animations.css";
import puertaImg from "@assets/TerplacFoto1.png";
import Notification from "@components/Notification";
import { recoverPassword } from "@services/authService";

const RecoverPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Obtener token de la URL
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  // Nuevo: Solicitar email si no hay token
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setNotification({ message: "Ingresa un correo válido.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotification({ message: data.message || "Si el correo existe, se ha enviado un enlace para reestablecer la contraseña.", type: "success" });
      } else {
        setNotification({ message: data.message || "Error al solicitar recuperación.", type: "error" });
      }
    } catch (err) {
      setNotification({ message: "Error de red al solicitar recuperación.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setNotification({ message: "Token inválido o ausente.", type: "error" });
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setNotification({ message: "La contraseña debe tener al menos 8 caracteres.", type: "error" });
      return;
    }
    if (newPassword.length > 26) {
      setNotification({ message: "La contraseña debe tener máximo 26 caracteres.", type: "error" });
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(newPassword)) {
      setNotification({ message: "La contraseña solo puede contener letras y números.", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setNotification({ message: "Las contraseñas no coinciden.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await recoverPassword(token, newPassword);
      setNotification({ message: "Contraseña actualizada con éxito. Redirigiendo al login...", type: "success" });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.details || err?.response?.data?.message || "Error al actualizar la contraseña.";
      setNotification({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page fade-in-left">
      <div className="left-side">
        <img src={puertaImg} alt="Terplac fondo" className="background-img" />
        <div className="text-overlay-login">
          <div className="dot"></div>
          <h1>{token ? "Restablecer contraseña" : "Recupera tu contraseña"}</h1>
          <p>{token ? "Ingresa una nueva contraseña para tu cuenta." : "Ingresa tu correo electrónico para recibir un enlace de recuperación."}</p>
        </div>
      </div>
      <div className="right-side">
        {!token ? (
          <form className="form" onSubmit={handleEmailSubmit}>
            <div className="back-home-row">
              <Link to="/login" className="back-home-btn">
                <i className="bi bi-arrow-left"></i> Volver al login
              </Link>
            </div>
            <div className="form-header">
              <h2>Recuperar contraseña</h2>
            </div>
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
              />
            )}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>
          </form>
        ) : (
          <form className="form" onSubmit={handlePasswordSubmit}>
            <div className="back-home-row">
              <Link to="/login" className="back-home-btn">
                <i className="bi bi-arrow-left"></i> Volver al login
              </Link>
            </div>
            <div className="form-header">
              <h2>Restablecer contraseña</h2>
            </div>
            <label>Nueva contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={8}
                maxLength={26}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(prev => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
              </button>
            </div>
            <label>Confirmar contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirma la nueva contraseña"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              maxLength={26}
            />
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
              />
            )}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecoverPassword; 