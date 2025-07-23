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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setNotification({ message: "Token inválido o ausente.", type: "error" });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setNotification({ message: "La contraseña debe tener al menos 6 caracteres.", type: "error" });
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
          <h1>Recupera tu contraseña</h1>
          <p>Ingresa una nueva contraseña para tu cuenta.</p>
        </div>
      </div>
      <div className="right-side">
        <form className="form" onSubmit={handleSubmit}>
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
              minLength={6}
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
            minLength={6}
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
      </div>
    </div>
  );
};

export default RecoverPassword; 