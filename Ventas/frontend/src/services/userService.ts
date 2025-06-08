// filepath: [UserService.ts](http://_vscodecontentref_/1)
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log("Token en localStorage:", token); // <-- Agrega esto
    if (!token) throw new Error("No hay token de autenticación");
   
    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error.response?.data ?? error.message);
    throw error;
  }
};