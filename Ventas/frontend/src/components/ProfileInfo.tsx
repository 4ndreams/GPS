import React from "react";

const mockUser = {
  nombre: "Juan Pérez",
  email: "juan.perez@email.com",
  telefono: "+34 600 123 456",
};

const ProfileInfo: React.FC = () => (
  <div className="profile-info">
    <h2>{mockUser.nombre}</h2>
    <p><strong>Email:</strong> {mockUser.email}</p>
    <p><strong>Teléfono:</strong> {mockUser.telefono}</p>
  </div>
);

export default ProfileInfo;