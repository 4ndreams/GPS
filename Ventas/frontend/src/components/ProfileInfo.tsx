import React, { useEffect, useState } from "react";
import "@styles/ProfileInfo.css";
import { getUserProfile } from "@services/userService.ts";
import ModalProfile from "./ModalProfile";
import { updateUserProfile } from "@services/userService"; 
import Notification from "./Notification"; 
import { changeUserPassword } from "@services/userService";

// Función para validar el formato del email
const validateEmail = (email: string): boolean => {
  const allowedDomains = ["@gmail.com", "@hotmail.com", "@outlook.com", "@yahoo.com", "@gmail.cl"];
  return allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
};

// Función para validar el formato del nombre y apellidos (solo letras y espacios)
const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return nameRegex.test(name);
};

// Función para validar RUT chileno
const validateRut = (rut: string): { valid: boolean; message?: string } => {
  if (!rut) {
    return { valid: false, message: 'RUT vacío' };
  }

  // Verificar que tenga el formato correcto con guión
  if (!rut.includes('-')) {
    return { valid: false, message: 'El RUT debe incluir un guión (ej: 12345678-5)' };
  }

  // Limpia solo puntos, mantiene el guión
  const cleanRut = rut.replace(/\./g, "").toUpperCase();

  // Requiere al menos 2 caracteres
  if (cleanRut.length < 2) {
    return { valid: false, message: 'RUT demasiado corto' };
  }

  const rutNumber = cleanRut.slice(0, -1);
  let dv = cleanRut.slice(-1);

  if (!/^\d+$/.test(rutNumber)) {
    return { valid: false, message: 'RUT debe contener solo números' };
  }
  
  if (!/^[0-9K]$/i.test(dv)) {
    return { valid: false, message: 'Dígito verificador inválido' };
  }

  if (dv === "K") dv = "k";

  // Calcular dígito verificador
  let M = 0, S = 1;
  let rutNum = parseInt(rutNumber, 10);
  for (; rutNum; rutNum = Math.floor(rutNum / 10)) {
    S = (S + (rutNum % 10) * (9 - (M++ % 6))) % 11;
  }
  const calculatedDv = S ? (S - 1).toString() : "k";

  if (dv !== calculatedDv) {
    return { valid: false, message: 'Dígito verificador incorrecto' };
  }

  return { valid: true };
};


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
    if (!editData || !user) return;
    
    console.log('Original user data:', user);
    console.log('Edit data:', editData);
    
    // Validar que los campos no estén vacíos y que hayan cambiado
    const dataToSend: any = {};
    
    if (editData.nombre && editData.nombre.trim() && editData.nombre.trim() !== user.nombre) {
      const nombre = editData.nombre.trim();
      if (!validateName(nombre)) {
        setNotification({ 
          message: "El nombre solo puede contener letras y espacios", 
          type: "error" 
        });
        return;
      }
      dataToSend.nombre = nombre;
    }
    
    if (editData.apellidos && editData.apellidos.trim() && editData.apellidos.trim() !== user.apellidos) {
      const apellidos = editData.apellidos.trim();
      if (!validateName(apellidos)) {
        setNotification({ 
          message: "Los apellidos solo pueden contener letras y espacios", 
          type: "error" 
        });
        return;
      }
      dataToSend.apellidos = apellidos;
    }
    
    if (editData.email && editData.email.trim() && editData.email.trim() !== user.email) {
      const email = editData.email.trim();
      if (!validateEmail(email)) {
        setNotification({ 
          message: "El email debe terminar en uno de los siguientes dominios: @gmail.com, @hotmail.com, @outlook.com, @yahoo.com, @gmail.cl", 
          type: "error" 
        });
        return;
      }
      dataToSend.email = email;
    }
    
    if (editData.rut && editData.rut.trim() && editData.rut.trim() !== user.rut) {
      const rut = editData.rut.trim();
      const rutValidation = validateRut(rut);
      
      if (!rutValidation.valid) {
        setNotification({ 
          message: rutValidation.message || "RUT inválido", 
          type: "error" 
        });
        return;
      }
      
      // Limpiar el RUT de puntos pero mantener el guión para el envío
      const cleanRut = rut.replace(/\./g, '');
      dataToSend.rut = cleanRut;
    }
    
    console.log('Data to send:', dataToSend);
    
    // Verificar que al menos un campo válido se está enviando
    if (Object.keys(dataToSend).length === 0) {
      setNotification({ 
        message: "No se han realizado cambios en el perfil", 
        type: "info" 
      });
      return;
    }
    
    await updateUserProfile(dataToSend);
    setUser({ ...user!, ...dataToSend }); // para que los cambios se reflejen inmediatamente
    setIsModalOpen(false);
    setNotification({ message: "Perfil actualizado correctamente", type: "success" });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    // Manejar diferentes tipos de errores
    let errorMessage = "Ocurrió un error al actualizar el perfil";
    
    if (error?.response?.data?.details) {
      errorMessage = error.response.data.details;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    setNotification({ message: errorMessage, type: "error" });
  }
  };

  const handleChangePassword = async (current: string, newPass: string) => {
    try {
      await changeUserPassword(current, newPass);
      return true;
    } catch (error: any) {
      const msg = error?.response?.data?.details || error?.details || "Ocurrió un error al cambiar la contraseña";
      setNotification({ message: msg, type: "error" });
      return false;
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
        onChangePassword={handleChangePassword}
      />
    </div>
    </>
  );
};

export default ProfileInfo;
