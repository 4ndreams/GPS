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

    console.log('Sending data to update profile:', data);

    const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/users/profile/edit`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error('Error in updateUserProfile:', error);
    console.error('Request data:', data);
    console.error('Response:', error.response?.data);
    
    // Re-throw the error with more context
    if (error.response?.data) {
      throw new Error(error.response.data.details || error.response.data.message || error.message);
    }
    throw error;
  }
};

export const changeUserPassword = async (currentPassword: string, newPassword: string) => {
  try {
    const token = TokenService.getToken();
    if (!token) throw new Error("No hay token de autenticación");
    
    console.log('Sending password change data:', { password: currentPassword, newPassword });
    
    const response = await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}/users/profile/edit`,
      { password: currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error in changeUserPassword:', error);
    console.error('Request data:', { password: currentPassword, newPassword });
    console.error('Response:', error.response?.data);
    
    // Re-throw the error with more context
    if (error.response?.data) {
      throw new Error(error.response.data.details || error.response.data.message || error.message);
    }
    throw error;
  }
};