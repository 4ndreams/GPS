import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@styles/Login.css";
import "@styles/animations.css";
import puertaImg from "@assets/TerplacFoto1.png";
import Notification from "@components/Notification";
import { loginUser, getGoogleAuthUrl } from "@services/authService";
import { getUserProfile } from "@services/userService";

interface LoginProps {
  setUser: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      const token = data?.token;

      if (!token) {
        setNotification({ message: data.details || "Error al iniciar sesión", type: "error" });
        setLoading(false);
        return;
      }

      const user = await getUserProfile();
      setUser(user);

      setNotification({ message: "Inicio de sesión exitoso, redirigiendo...", type: "success" });

      setTimeout(() => {
        navigate("/profile");
      }, 800);
    } catch (err: any) {
        const apiError = err.response?.data;
        let detailMsg = "";
          if (typeof apiError?.details === "string") {
            detailMsg = apiError.details;
          } else if (typeof apiError?.details === "object" && apiError.details?.message) {
            detailMsg = apiError.details.message;
          }
        const mainMsg = apiError?.message;
        console.log("Error de api: ", apiError,"Error mensaje: ", detailMsg,"Mensaje principal", mainMsg);
          setNotification({
            message: detailMsg || mainMsg || "Error en el servidor",
            type: "error"
          });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleAuthUrl();
  };

  const handleFacebookLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/facebook`;
  };

  return (
    <div className="login-page fade-in-left">
      <div className="left-side">
        <img src={puertaImg} alt="Terplac fondo" className="background-img" />
        <div className="text-overlay-login">
          <div className="dot"></div>
          <h1>Bienvenido</h1>
          <p>Ingresa con tu cuenta para continuar usando la plataforma.</p>
        </div>
      </div>

      <div className="right-side">
        <form className="form" onSubmit={handleSubmit}>
          <div className="back-home-row" style={{ marginTop: '2.5rem' }}>
            <Link to="/" className="back-home-btn">
              <i className="bi bi-arrow-left"></i> Volver al inicio
            </Link>
          </div>
          <div className="form-header">
            <h2>Ingresa</h2>
            <div className="no-account">
              <span>¿No tienes una cuenta?</span>
              <Link to="/register" className="ingresa-link">Crea una</Link>
            </div>
          </div>

          <button type="button" className="secondary-btn" onClick={handleGoogleLogin}>
            <i className="bi bi-google"></i> Continuar con Google
          </button>
          <button type="button" className="secondary-btn" onClick={handleFacebookLogin}>
            <i className="bi bi-facebook"></i> Continuar con Facebook
          </button>

          <div className="divider"><span>o</span></div>

          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
            </button>
          </div>
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}

          <button type="submit" className="submit-btn" disabled={!email.trim() || !password.trim() || loading}>
            Ingresar
          </button>

          <div style={{ textAlign: 'center', margin: '0.5rem 0 1rem 0' }}>
            <Link to="/recover-password" className="forgot-password-link" style={{ fontSize: '0.95em', color: '#666' }}>¿Olvidaste tu contraseña?</Link>
          </div>

          <div className="divider"><span>o</span></div>

          <Link to="/register" className="secondary-btn">
            Crear una cuenta nueva
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;