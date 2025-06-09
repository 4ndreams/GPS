import React, { useEffect, useState } from "react";
import "../styles/ProfileInfo.css";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile()
      .then((data: UserProfile) => {
        setUser(data);
        onUserLoaded && onUserLoaded(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="profile-info">Cargando...</div>;

  if (!user) return <div className="profile-info">No se pudo cargar el perfil.</div>;

  return (
    <div className="profile-info-card">
      <div className="profile-info-header">
        <h2>Perfil</h2>
        <button className="profile-edit-btn"><i className="bi bi-pencil-square"></i>EDITAR</button>
      </div>
      <div className="profile-info-main">
        <div className="profile-info-grid">
          <div>
            <div className="profile-label">Nombre</div>
            <div className="profile-value">{user.nombre}</div>
          </div>
          <div>
            <div className="profile-label">Apellido</div>
            <div className="profile-value">{user.apellidos}</div>
          </div>
          <div>
            <div className="profile-label">Email</div>
            <div className="profile-value">{user.email}</div>
          </div>
          <div>
            <div className="profile-label">RUT</div>
            <div className="profile-value">{user.rut}</div>
          </div>
          <div>
            <div className="profile-label">Teléfono</div>
            <div className="profile-value">{user.telefono || "No registrado"}</div>
          </div>
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
    </div>
  );
};

export default ProfileInfo;