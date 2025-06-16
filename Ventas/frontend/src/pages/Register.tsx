import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Notification from "../components/Notification";
import "../styles/Register.css";
import "../styles/animations.css";
import puertaImg from "../assets/TerplacFoto1.png";


function formatRut(rut: string) {
  rut = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
  if (rut.length < 2) return rut;
  const body = rut.slice(0, -1);
  const dv = rut.slice(-1);
  return body.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
}

function Register() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    rut: "",
    email: "",
    password: "",
    accept: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formattedRut = formatRut(formData.rut);

    try {
      const res = await axios.post(`${import.meta.env.VITE_META_BASE_URL}api/register`, {
        nombre: formData.nombres,
        apellidos: formData.apellidos,
        rut: formattedRut,
        email: formData.email,
        password: formData.password,
      });

      setNotification({ message: "Confirma tu correo electrónico para continuar.", type: "success" });
    } catch (err) {
      console.error(err);
      setNotification({ message: "Error al registrar. Verifica los campos.", type: "error" });
    }
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
          <div className="back-home-row">
              <Link to="/" className="back-home-btn">
              <i className="bi bi-arrow-left"></i> Volver al inicio
            </Link>
          </div>
          <div className="form-header">
            <h2>Crea una cuenta</h2>
            <Link to="/login" className="ingresa-link">Ingresa</Link>
          </div>

          <input type="text" name="nombres" placeholder="Nombres" onChange={handleChange} required />
          <input type="text" name="apellidos" placeholder="Apellidos" onChange={handleChange} required />
          <input type="text" name="rut" placeholder="RUT (con o sin puntos, con guion)" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />

          <label className="checkbox">
            <input type="checkbox" name="accept" onChange={handleChange} required />
            Estoy de acuerdo con los <a href="#">Términos de Uso</a> y las <a href="#">Políticas de privacidad</a>.
          </label>

          <button type="submit" className="submit-btn">
            Crea una cuenta
          </button>

          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}

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
