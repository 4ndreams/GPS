import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import "../styles/animations.css";
import puertaImg from "../assets/TerplacFoto1.png";
import Notification from "../components/Notification";


const Login: React.FC = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        credentials: "include", // para cookies JWT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Respuesta login:", data);
      if (!response.ok) {
        setNotification({ message: data.message || "Error al iniciar sesión", type: "error" });
        setLoading(false);        
        return;
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setNotification({ message: "Inicio de sesión exitoso", type: "success" });
      navigate("/profile");
      // aquí podrías redirigir con navigate("/dashboard") si usas react-router
    } catch (err) {
            setNotification({ message: "Error en el servidor", type: "error" });

    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/facebook";
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
          <div className="back-home-row">
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

          <button type="submit" 
                  className="submit-btn"
                disabled={!email.trim() || !password.trim() || loading}
          >
              Ingresar
          </button>

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
