import { useState } from "react";
import { Link } from "react-router-dom";
import Notification from "../components/Notification";
import "../styles/Register.css";
import "../styles/animations.css";
import puertaImg from "../assets/TerplacFoto1.png";
import { registerUser } from "../services/authService";
import { formatRut, validateField } from "../utils/validations";

function Register() {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    rut: "",
    email: "",
    password: "",
    accept: false,
  });

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string | null}>({});
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    // Formateo especial para el RUT
    if (name === 'rut' && typeof newValue === 'string') {
      newValue = formatRut(newValue);
      
      // Limitar a 10 caracteres máximo (8 dígitos + guión + 1 dígito verificador)
      if (newValue.length > 10) {
        newValue = newValue.substring(0, 10);
      }
    }

    // Actualizar el estado del formulario
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validar en tiempo real solo para campos de texto
    if (type !== "checkbox") {
      const error = validateField(name, newValue as string);
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    const errors: {[key: string]: string | null} = {};
    errors.nombres = validateField('nombres', formData.nombres);
    errors.apellidos = validateField('apellidos', formData.apellidos);
    errors.rut = validateField('rut', formData.rut);
    errors.email = validateField('email', formData.email);
    errors.password = validateField('password', formData.password);

    // Verificar si hay errores
    const hasErrors = Object.values(errors).some(error => error !== null);
    if (hasErrors) {
      setValidationErrors(errors);
      setNotification({ 
        message: "Por favor corrige los errores en el formulario", 
        type: "error" 
      });
      return;
    }

    // Verificar checkbox de términos
    if (!formData.accept) {
      setNotification({ 
        message: "Debes aceptar los términos y condiciones", 
        type: "error" 
      });
      return;
    }

    try {
      await registerUser({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        rut: formData.rut, // Ya viene formateado sin puntos y con guión
        email: formData.email,
        password: formData.password,
      });

      setNotification({ 
        message: "Confirma tu correo electrónico para continuar.", 
        type: "success" 
      });
      
      // Limpiar formulario después del éxito
      setFormData({
        nombres: "",
        apellidos: "",
        rut: "",
        email: "",
        password: "",
        accept: false,
      });
      setValidationErrors({});
      
    } catch (err: any) {
      setNotification({ 
        message: err.response?.data?.details || "Error al registrar. Verifica los campos.", 
        type: "error" 
      });
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

          <div className="form-fields">
            <div className="field-group">
              <input 
                type="text" 
                name="nombres" 
                placeholder="Nombres" 
                value={formData.nombres}
                onChange={handleChange} 
                className={validationErrors.nombres ? 'error' : ''}
                required 
              />
              {validationErrors.nombres && (
                <span className="error-message">{validationErrors.nombres}</span>
              )}
            </div>

            <div className="field-group">
              <input 
                type="text" 
                name="apellidos" 
                placeholder="Apellidos" 
                value={formData.apellidos}
                onChange={handleChange} 
                className={validationErrors.apellidos ? 'error' : ''}
                required 
              />
              {validationErrors.apellidos && (
                <span className="error-message">{validationErrors.apellidos}</span>
              )}
            </div>

            <div className="field-group">
              <input 
                type="text" 
                name="rut" 
                placeholder="RUT (ej: 12345678-9)" 
                value={formData.rut}
                onChange={handleChange} 
                className={validationErrors.rut ? 'error' : ''}
                maxLength={10}
                required 
              />
              {validationErrors.rut && (
                <span className="error-message">{validationErrors.rut}</span>
              )}
            </div>

            <div className="field-group">
              <input 
                type="email" 
                name="email" 
                placeholder="Correo electrónico" 
                value={formData.email}
                onChange={handleChange} 
                className={validationErrors.email ? 'error' : ''}
                required 
              />
              {validationErrors.email && (
                <span className="error-message">{validationErrors.email}</span>
              )}
            </div>

            <div className="field-group">
              <input 
                type="password" 
                name="password" 
                placeholder="Contraseña (mínimo 6 caracteres)" 
                value={formData.password}
                onChange={handleChange} 
                className={validationErrors.password ? 'error' : ''}
                required 
              />
              {validationErrors.password && (
                <span className="error-message">{validationErrors.password}</span>
              )}
            </div>
          </div>

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
