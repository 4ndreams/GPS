import axios from 'axios';
import { TokenService } from './tokenService';

// Función para iniciar sesión con email y contraseña
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, 
      { email, 
        password 
      });
    if (response.data.data.token) {
      // Usar el nuevo sistema de gestión de tokens
      TokenService.setToken(response.data.data.token);
    }
    return response.data.data;
  } catch (error: any) {
    console.error("Error en el inicio de sesión:", error.response?.data ?? error.message);
    throw error;
  }
};

// Función para registrar usuarios
export const registerUser = async (userData: {
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/register`,
    {
      nombre: userData.nombres,
      apellidos: userData.apellidos,
      rut: userData.rut,
      email: userData.email,
      password: userData.password,
    }
  );
  return response.data;
};

export const getGoogleAuthUrl = () => {
  return `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
};

export const loginWithGoogle = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE.API_BASE_URL}/auth/google`, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    console.error("Error en Google Login:", error.response?.data ?? error.message);
    throw error;
  }
};

export const loginWithFacebook = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/facebook`, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    console.error("Error en Facebook Login:", error.response?.data ?? error.message);
    throw error;
  }
};

export const verifyEmail = async (token: string) => {
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}/verify-email`, { params: { token } });
};