import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import "../styles/animations.css"; 
import puertaImg from "../assets/TerplacFoto1.png";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            setError("");
            alert("Login exitoso");
            // Redirigir o guardar estado de login aquí
        } else {
            setError("Por favor ingresa correo y contraseña");
        }
    };

    return (
        <div className="login-page fade-in-left">
            <div className="left-side">
                <img src={puertaImg} alt="Terplac fondo" className="background-img" />
                <div className="text-overlay-login">
                    <div className="dot"></div>
                        <h1>Bienvenido</h1>
                        <p>
                            Ingresa con tu cuenta para continuar usando la plataforma.
                        </p>
                    </div>
                </div>
            <div className="right-side">
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <h2>Ingresa</h2>
                      <div className="no-account">
                        <span>¿No tienes una cuenta?</span>
                        <Link to="/register" className="ingresa-link">Crea una</Link>
                      </div>
                    </div>
                    <Link to={'google.com'} className="secondary-btn" onClick={() => alert("Login con Google")}>
                        <i className="bi bi-google"></i>Continuar con Google
                    </Link>
                    <Link to={'google.com'} className="secondary-btn" onClick={() => alert("Login con Facebook")}>
                        <i className="bi bi-facebook"></i>Continuar con Facebook
                    </Link>
                    <div className="divider">
                        <span>o</span>
                    </div>
                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Contraseña</label>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <span style={{ color: "red" }}>{error}</span>}
                    <button type="submit" className="submit-btn" disabled>
                        Entrar
                    </button>
                    <div className="divider">
                        <span>o</span>
                    </div>
                    <Link to="/register" className="secondary-btn">
                        Crear una cuenta nueva
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Login;