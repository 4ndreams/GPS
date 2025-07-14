import React, { useEffect, useState } from "react";
import "../styles/ProfileInfo.css";
import { getUserProfile } from "../services/userService.ts";
import ModalProfile from "./ModalProfile";
import { updateUserProfile } from "../services/userService"; 
import Notification from "./Notification"; 


type UserProfile = {
  nombre: string;
  apellidos: string;
  email: string;
  rol: string;
  correoVerificado: boolean;
  telefono?: string;
  rut: string;
};

const ProfileInfo: React.FC<{ onUserLoaded?: (user: UserProfile) => void }> = ({ onUserLoaded }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editData, setEditData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type?: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    getUserProfile()
      .then((data: UserProfile) => {
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
    if (!editData) return;
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  try {
    if (!editData) return;
    // Solo los campos que se editarán, sino queda senda cagada
    const dataToSend = {
      nombre: editData.nombre,
      apellidos: editData.apellidos,
      email: editData.email,
      rut: editData.rut,
      /*aqui van mas weas pa los campos*/ 
    };
    await updateUserProfile(dataToSend);
    setUser({ ...user!, ...dataToSend }); // para que los cambios se reflejen inmediatamente
    setIsModalOpen(false);
    setNotification({ message: "Perfil actualizado correctamente", type: "success" });
  } catch (error: any) {
    const msg =
      error?.response?.data?.details ||
      error?.details ||
      "Ocurrió un error al actualizar el perfil";
    setNotification({ message: msg, type: "error" });
  }
  };

  if (loading) return <div className="profile-info">Cargando...</div>;
  if (!user) return <div className="profile-info">No se pudo cargar el perfil.</div>;


  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
    )}
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
          <div><div className="profile-label">Teléfono</div><div className="profile-value">{user.telefono ?? "No registrado"}</div></div>
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

      <ModalProfile
        isOpen={isModalOpen}
        editData={editData}
        onChange={handleChange}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
    </>
  );
};

export default ProfileInfo;
