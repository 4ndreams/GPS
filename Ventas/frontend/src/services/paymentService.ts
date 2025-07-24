import axios from 'axios';
import { TokenService } from './tokenService';

interface OrderItem {
  id: number;
  nombre: string;
  precio: number;
  quantity: number;
  imagen: string;
  categoria: string;
}

interface ContactInfo {
  nombre: string;
  apellidos: string;
  email: string;
}

interface CreateOrderData {
  contactInfo: ContactInfo;
  items: OrderItem[];
  total: number;
}

// Crear orden en el backend y obtener preference_id de Mercado Pago
export const createPaymentOrder = async (orderData: CreateOrderData) => {
  try {
    const token = TokenService.getToken();
    
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/orders/create-payment`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Error creando orden de pago:', error);
    throw error;
  }
};

// Verificar el estado del pago
export const verifyPaymentStatus = async (paymentId: string, orderId: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/orders/verify-payment/${paymentId}/${orderId}`
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Error verificando estado del pago:', error);
    throw error;
  }
};

// Obtener órdenes del usuario (si está logueado)
export const getUserOrders = async () => {
  try {
    const token = TokenService.getToken();
    if (!token) throw new Error('No hay token de autenticación');

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/orders/user-orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Error obteniendo órdenes del usuario:', error);
    throw error;
  }
};
