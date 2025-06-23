import React from "react";
import "../styles/modal.css";

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
          <label>Nombre:<input
              type="text"
              name="nombre"
              value={editData?.nombre ?? ""}
              onChange={onChange}
              placeholder="Nombre"
            />
          </label>
          <label>Apellidos:<input
              type="text"
              name="apellidos"
              value={editData?.apellidos ?? ""}
              onChange={onChange}
              placeholder="Apellidos"
            />
          </label>

          <label>Rut:<input
              type="text"
              name="rut"
              value={editData?.rut ?? ""}
              onChange={onChange}
              placeholder="Rut"
            />
          </label>
          <label>Teléfono:<input
              type="text"
              name="telefono"
              value={editData?.telefono ?? ""}
              onChange={onChange}
              placeholder="Teléfono"
            />
          </label>
        </div>

        <footer className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="save-btn" onClick={onSave}>Guardar</button>
        </footer>
      </div>
    </div>
  );
};

export default ModalProfile;