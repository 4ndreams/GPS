// src/pages/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Register.css"; 
import "../styles/animations.css"; 
import puertaImg from "../assets/TerplacFoto1.png";


function Register() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    accept: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="register-page fade-in-left">
      <div className="left-side">
        <img src={puertaImg} alt="Terplac fondo" className="background-img" />
        <div className="text-overlay-login">
          <div className="dot"></div>
            <h1>Bienvenido</h1>
            <p>
              Crea tu cuenta para una experiencia personalizada o ingresa con tu cuenta ya creada
            </p>
        </div>
      </div>

      <div className="right-side">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Crea una cuenta</h2>
            <Link to="/login" className="ingresa-link">Ingresa</Link>
          </div>

          <input type="text" name="nombres" placeholder="Nombres" onChange={handleChange} required />
          <input type="text" name="apellidos" placeholder="Apellidos" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />

          <label className="checkbox">
            <input type="checkbox" name="accept" onChange={handleChange} required />
            Estoy de acuerdo con los <a href="#">Términos de Uso</a> y las <a href="#">Políticas de privacidad</a>.
          </label>

          <button type="submit" className="submit-btn" disabled>
            Crea una cuenta
          </button>

          <div className="divider">
            <span>0</span>
          </div>

          <Link to="/login" className="secondary-btn">
            Ingresa con tu cuenta ya creada
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
