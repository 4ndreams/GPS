import React, { useState } from "react";
import '../styles/Login.css'; // Asegúrate de tener este archivo CSS


const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica de autenticación real
        if (email && password) {
            setError("");
            alert("Login exitoso");
            // Redirigir o guardar estado de login aquí
        } else {
            setError("Por favor ingresa correo y contraseña");
        }
    };

return (
    <div className="body-login">
        <div className="login-container">
            <div className="login-left">
                <div className="login-card">
                    <h1>Iniciar Sesión</h1>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: "300px" }}>
                        <input
                            type="email"
                            placeholder="Correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Entrar</button>
                        {error && <span style={{ color: "red" }}>{error}</span>}
                    </form>
                </div>
            </div>
            <div className="login-right"></div>
        </div>
    </div>
);
}

export default Login;