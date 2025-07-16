import React, { useState, useEffect } from "react";
import "@styles/modal.css";
import { formatRut, validateField } from "@utils/validations";

type ModalProfileProps = {
  isOpen: boolean;
  editData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSave: () => void;
};

const ModalProfile: React.FC<ModalProfileProps> = ({
  isOpen,
  editData,
  onChange,
  onClose,
  onSave,
}) => {
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string | null}>({});

  // Limpiar errores cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setValidationErrors({});
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