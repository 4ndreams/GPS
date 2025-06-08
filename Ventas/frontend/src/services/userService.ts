// filepath: [UserService.ts](http://_vscodecontentref_/1)
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token'); 
    if (!token) throw new Error("No hay token de autenticación");

    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};