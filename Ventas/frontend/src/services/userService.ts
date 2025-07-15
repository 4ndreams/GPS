import axios from 'axios';
import { TokenService } from './tokenService';

export const getUserProfile = async () => {
  try {
    const token = TokenService.getToken(); 
    if (!token) throw new Error("No hay token de autenticación");

    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateUserProfile = async (data: any) => {
  try {
    const token = TokenService.getToken(); 
    if (!token) throw new Error("No hay token de autenticación");

    const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/users/profile/edit`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};