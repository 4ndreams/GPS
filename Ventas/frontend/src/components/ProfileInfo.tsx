import React, { useEffect, useState } from "react";
import "../styles/ProfileInfo.css";
import "../styles/Modal.css";
import { getUserProfile } from "../services/userService.ts";

type UserProfile = {
  nombre: string;
  apellidos: string;
  email: string;
  correoVerificado: boolean;
  telefono?: string;
  rut: string;
};

const ProfileInfo: React.FC<{ onUserLoaded?: (user: UserProfile) => void }> = ({ onUserLoaded }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editData, setEditData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getUserProfile()
      .then((data: UserProfile) => {
        console.log("🔍 Datos recibidos del backend:", data);
        setUser(data);
        onUserLoaded && onUserLoaded(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEditClick = () => {
    setEditData(user); // copia los datos actuales al formulario
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData!, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Aquí luego conectarás con el backend (PUT / PATCH)
    setUser(editData);
    setIsModalOpen(false);
  };

  if (loading) return <div className="profile-info">Cargando...</div>;
  if (!user) return <div className="profile-info">No se pudo cargar el perfil.</div>;

  return (
    <div className="profile-info-card">
      <div className="profile-info-header">
        <h2>Perfil</h2>
        <button className="profile-edit-btn" onClick={handleEditClick}>
          <i className="bi bi-pencil-square"></i>EDITAR
        </button>
      </div>

      <div className="profile-info-main">
        <div className="profile-info-grid">
          <div><div className="profile-label">Nombre</div><div className="profile-value">{user.nombre}</div></div>
          <div><div className="profile-label">Apellido</div><div className="profile-value">{user.apellidos}</div></div>
          <div><div className="profile-label">Email</div><div className="profile-value">{user.email}</div></div>
          <div><div className="profile-label">RUT</div><div className="profile-value">{user.rut}</div></div>
          <div><div className="profile-label">Teléfono</div><div className="profile-value">{user.telefono || "No registrado"}</div></div>
        </div>
        <div className="profile-newsletter-box">
          <div className="profile-label" style={{ fontWeight: 600 }}>Boletín informativo</div>
          <div className="profile-newsletter-desc">¿Quiere recibir boletines informativos promocionales?</div>
          <label className="profile-checkbox">
            <input type="checkbox" />
            <span>Quiero recibir el boletín informativo con promociones.</span>
          </label>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
  <div className="modal-overlay">
    <div className="modal-container">
      <header className="modal-header">
        <h2>Editar Perfil</h2>
        <button className="close-btn" onClick={() => setIsModalOpen(false)} aria-label="Cerrar">
          &times;
        </button>
      </header>

      <div className="modal-body">
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={editData?.nombre || ""}
            onChange={handleChange}
            placeholder="Nombre"
          />
        </label>
        <label>
          Apellidos:
          <input
            type="text"
            name="apellidos"
            value={editData?.apellidos || ""}
            onChange={handleChange}
            placeholder="Apellidos"
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={editData?.email || ""}
            onChange={handleChange}
            placeholder="email"
          />
          <label>
          Rut:
          <input
            type="text"
            name="rut"
            value={editData?.rut || ""}
            onChange={handleChange}
            placeholder="Rut"
          />
        </label>
        </label>
        <label>
          Teléfono:
          <input
            type="text"
            name="telefono"
            value={editData?.telefono || ""}
            onChange={handleChange}
            placeholder="Teléfono"
          />
        </label>
      </div>

      <footer className="modal-actions">
        <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
        <button className="save-btn" onClick={handleSave}>Guardar</button>
      </footer>
    </div>
  </div>
)}

    </div>
  );
};

export default ProfileInfo;
