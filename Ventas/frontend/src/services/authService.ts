import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Función para iniciar sesión con email y contraseña
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error: any) {
    console.error("Error en el login:", error.response?.data || error.message);
    throw error;
  }
};

// Función para registrar usuarios
export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error: any) {
    console.error("Error en el registro:", error.response?.data || error.message);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/google`, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    console.error("Error en Google Login:", error.response?.data || error.message);
    throw error;
  }
};

export const loginWithFacebook = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/facebook`, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    console.error("Error en Facebook Login:", error.response?.data || error.message);
    throw error;
  }
};

export const verifyEmail = async (token: string) => {
  return axios.get(`${API_BASE_URL}/verify-email`, { params: { token } });
};