import React, { useEffect, useState } from "react";
import "../styles/ProfileInfo.css";
import { getUserProfile } from "../services/UserService";

const ProfileInfo: React.FC = () => {
  const [user, setUser] = useState<{ nombre: string; email: string; telefono: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setUser(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="profile-info">Cargando...</div>;
  

  if (!user) return <div className="profile-info">No se pudo cargar el perfil.</div>;

  return (
    <div className="profile-info">
      <h2>{user.nombre}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Teléfono:</strong> {user.telefono}</p>
    </div>
  );
};

export default ProfileInfo;