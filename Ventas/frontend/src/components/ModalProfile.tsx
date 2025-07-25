import React, { useState, useEffect } from "react";
import "@styles/modal.css";
import { formatRut, validateField } from "@utils/validations";

type ModalProfileProps = {
  isOpen: boolean;
  editData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSave: () => void;
  onChangePassword?: (current: string, newPass: string) => Promise<boolean>;
};

const ModalProfile: React.FC<ModalProfileProps> = ({
  isOpen,
  editData,
  onChange,
  onClose,
  onSave,
  onChangePassword,
}) => {
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string | null}>({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Limpiar errores cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setValidationErrors({});
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError(null);
      setPasswordSuccess(null);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // Formateo especial para el RUT
    if (name === 'rut') {
      newValue = formatRut(newValue);
      
      // Limitar a 10 caracteres máximo (8 dígitos + guión + 1 dígito verificador)
      if (newValue.length > 10) {
        newValue = newValue.substring(0, 10);
      }
    }

    // Crear el evento modificado con el valor formateado
    const modifiedEvent = {
      target: {
        name,
        value: newValue
      }
    } as React.ChangeEvent<HTMLInputElement>;

    // Llamar al onChange del componente padre
    onChange(modifiedEvent);

    // Validar en tiempo real
    const error = validateField(name, newValue);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSave = () => {
    // Validar todos los campos antes de guardar
    const errors: {[key: string]: string | null} = {};
    errors.nombre = validateField('nombres', editData?.nombre || '');
    errors.apellidos = validateField('apellidos', editData?.apellidos || '');
    errors.rut = validateField('rut', editData?.rut || '');

    // Verificar si hay errores
    const hasErrors = Object.values(errors).some(error => error !== null);
    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }

    // Si no hay errores, guardar
    onSave();
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Debes completar todos los campos de contraseña.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword.length > 26) {
      setPasswordError("La nueva contraseña debe tener máximo 26 caracteres.");
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(newPassword)) {
      setPasswordError("La contraseña solo puede contener letras y números.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }
    setPasswordError(null);
    if (onChangePassword) {
      const ok = await onChangePassword(currentPassword, newPassword);
      if (ok) {
        setPasswordSuccess("Contraseña actualizada correctamente");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(null), 2500);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <header className="modal-header">
          <h2>Editar Perfil</h2>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </header>

        <div className="modal-body">
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={editData?.nombre ?? ""}
              onChange={handleChange}
              placeholder="Nombre"
              className={validationErrors.nombre ? 'error' : ''}
            />
            {validationErrors.nombre && (
              <span className="error-text">{validationErrors.nombre}</span>
            )}
          </label>

          <label>
            Apellidos:
            <input
              type="text"
              name="apellidos"
              value={editData?.apellidos ?? ""}
              onChange={handleChange}
              placeholder="Apellidos"
              className={validationErrors.apellidos ? 'error' : ''}
            />
            {validationErrors.apellidos && (
              <span className="error-text">{validationErrors.apellidos}</span>
            )}
          </label>

          <label>
            RUT:
            <input
              type="text"
              name="rut"
              value={editData?.rut ?? ""}
              onChange={handleChange}
              placeholder="12345678-9"
              className={validationErrors.rut ? 'error' : ''}
              maxLength={10}
            />
            {validationErrors.rut && (
              <span className="error-text">{validationErrors.rut}</span>
            )}
            <span className="help-text">Formato: 12345678-9 (sin puntos)</span>
          </label>

          <hr style={{ margin: '1.5rem 0' }} />
          <h3 style={{ marginBottom: 8 }}>Cambiar contraseña</h3>
          <label>
            Contraseña actual:
            <div className="password-input-wrapper">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Contraseña actual"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowCurrentPassword(prev => !prev)}
                tabIndex={-1}
                aria-label={showCurrentPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showCurrentPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
              </button>
            </div>
          </label>
          <label>
            Nueva contraseña:
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                minLength={8}
                maxLength={26}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowNewPassword(prev => !prev)}
                tabIndex={-1}
                aria-label={showNewPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showNewPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
              </button>
            </div>
          </label>
          <label>
            Confirmar nueva contraseña:
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirmar nueva contraseña"
                minLength={8}
                maxLength={26}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showConfirmPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
              </button>
            </div>
          </label>
          {passwordError && <span className="error-text">{passwordError}</span>}
          {passwordSuccess && <span className="success-text" style={{ color: 'green', display: 'block', marginTop: 8 }}>{passwordSuccess}</span>}
          <button className="save-btn" type="button" style={{ marginTop: 8, marginBottom: 16 }} onClick={handlePasswordChange}>Actualizar contraseña</button>
        </div>

        <footer className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="save-btn" onClick={handleSave}>Guardar</button>
        </footer>
      </div>
    </div>
  );
};

export default ModalProfile;