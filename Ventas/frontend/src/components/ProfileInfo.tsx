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

const ProfileInfo: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile()
      .then((data: UserProfile) => {
        setUser(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="profile-info">Cargando...</div>;

  if (!user) return <div className="profile-info">No se pudo cargar el perfil.</div>;

  return (
    <div className="profile-info">
      <h2>{user.nombre} {user.apellidos}</h2>
      <p><strong>RUT:</strong> {user.rut}</p>
      <p><strong>Teléfono:</strong> {user.telefono || "No registrado"}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Correo verificado:</strong> {user.correoVerificado ? "Sí" : "No"}</p>
    </div>
  );
};

export default ProfileInfo;