import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Interfaces para tipado
export interface CotizacionData {
  id_material: number;
  id_relleno: number;
  medida_ancho: number;
  medida_alto: number;
  medida_largo: number;
  tipo_puerta: string; // 'puertaPaso' o 'puertaCloset'
  mensaje: string;
  // Campos opcionales para usuarios no logueados
  nombre_apellido_contacto?: string;
  rut_contacto?: string;
  email_contacto?: string;
}

export interface CotizacionResponse {
  id_producto_personalizado: number;
  nombre_apellido_contacto: string;
  email_contacto: string;
  rut_contacto: string;
  telefono_contacto: string;
  mensaje: string;
  medida_ancho: number;
  medida_alto: number;
  medida_largo: number;
  tipo_puerta: string;
  estado: string;
  precio?: number; // Precio opcional, se asigna desde gestión
  createdAt: string;
  updatedAt: string;
  material: {
    id_material: number;
    nombre_material: string;
  };
  relleno: {
    id_relleno: number;
    nombre_relleno: string;
  };
  usuario?: {
    id_usuario: number;
    email: string;
  };
}

import { TokenService } from './tokenService';

// Función para obtener el token del localStorage
const getAuthToken = (): string | null => {
  return TokenService.getToken();
};

// Función para crear headers con o sin autenticación
const createHeaders = (includeAuth: boolean = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Crear cotización (funciona para usuarios logueados y anónimos)
export const crearCotizacion = async (data: CotizacionData): Promise<CotizacionResponse> => {
  try {
    const token = getAuthToken();
    const headers = createHeaders(!!token); // Incluir auth si hay token
    
    const response = await axios.post(
      `${API_BASE_URL}/productos-personalizados`,
      data,
      { headers }
    );
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error al crear cotización:', error);
    throw new Error(error.response?.data?.message ?? 'Error al crear la cotización');
  }
};

// Obtener cotizaciones del usuario logueado (requiere autenticación)
export const obtenerMisCotizaciones = async (): Promise<CotizacionResponse[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Debes estar logueado para ver tus cotizaciones');
    }
    
    const response = await axios.get(
      `${API_BASE_URL}/productos-personalizados/my`,
      { headers: createHeaders(true) }
    );
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error al obtener mis cotizaciones:', error);
    throw new Error(error.response?.data?.message ?? 'Error al obtener tus cotizaciones');
  }
};

// Obtener todas las cotizaciones (público)
export const obtenerTodasLasCotizaciones = async (): Promise<CotizacionResponse[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/productos-personalizados`,
      { headers: createHeaders(false) }
    );
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error al obtener cotizaciones:', error);
    throw new Error(error.response?.data?.message ?? 'Error al obtener las cotizaciones');
  }
};

// Obtener cotización por ID (público)
export const obtenerCotizacionPorId = async (id: number): Promise<CotizacionResponse> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/productos-personalizados/${id}`,
      { headers: createHeaders(false) }
    );
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error al obtener cotización:', error);
    throw new Error(error.response?.data?.message ?? 'Error al obtener la cotización');
  }
};

// Obtener cotizaciones por RUT (para usuarios anónimos)
export const obtenerCotizacionesPorRut = async (rut: string): Promise<CotizacionResponse[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/productos-personalizados/user?rut_contacto=${rut}`,
      { headers: createHeaders(false) }
    );
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error al obtener cotizaciones por RUT:', error);
    throw new Error(error.response?.data?.message ?? 'Error al obtener las cotizaciones');
  }
};

// Actualizar cotización (requiere autenticación)
export const actualizarCotizacion = async (id: number, data: CotizacionData): Promise<CotizacionResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Debes estar logueado para actualizar una cotización');
    }
    
    const response = await axios.put(
      `${API_BASE_URL}/productos-personalizados/${id}`,
      data,
      { headers: createHeaders(true) }
    );
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error al actualizar cotización:', error);
    throw new Error(error.response?.data?.message ?? 'Error al actualizar la cotización');
  }
};

// Actualizar estado de cotización (requiere autenticación)
export const actualizarEstadoCotizacion = async (id: number, estado: string): Promise<CotizacionResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Debes estar logueado para actualizar el estado');
    }
    
    const response = await axios.patch(
      `${API_BASE_URL}/productos-personalizados/${id}/estado`,
      { estado },
      { headers: createHeaders(true) }
    );
    
    return response.data.data;
  } catch (error: any) {
    console.error('Error al actualizar estado:', error);
    throw new Error(error.response?.data?.message ?? 'Error al actualizar el estado');
  }
};

// Eliminar cotización (requiere autenticación)
export const eliminarCotizacion = async (id: number): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Debes estar logueado para eliminar una cotización');
    }
    
    await axios.delete(
      `${API_BASE_URL}/productos-personalizados/${id}`,
      { headers: createHeaders(true) }
    );
  } catch (error: any) {
    console.error('Error al eliminar cotización:', error);
    throw new Error(error.response?.data?.message ?? 'Error al eliminar la cotización');
  }
};

// Verificar si el usuario está logueado
export const estaLogueado = (): boolean => {
  return TokenService.isTokenValid();
};
