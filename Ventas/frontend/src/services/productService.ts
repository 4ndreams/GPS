import axios from 'axios';
import { TokenService } from './tokenService';

// Función para actualizar un producto (solo administradores)
export const updateProduct = async (productId: number, updateData: { precio?: number; stock?: number }) => {
  try {
    const token = TokenService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    const response = await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}/products/${productId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};
