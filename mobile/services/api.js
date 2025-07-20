import axios from 'axios';
import { TokenService } from './tokenService';
import { config } from './config';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests - agregar token de autenticación
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await TokenService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al obtener token para request:', error);
    }
    return config;
  },
  (error) => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    // Respuesta exitosa, retornar tal como está
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si es error 401 (no autorizado)
    if (error.response?.status === 401) {
      // Si no es un request de login/register y no se ha intentado renovar
      if (!originalRequest._retry && 
          !originalRequest.url?.includes('/login') && 
          !originalRequest.url?.includes('/register')) {
        
        originalRequest._retry = true;
        
        try {
          // Intentar renovar el token
          const renewed = await TokenService.refreshTokenManually();
          if (renewed) {
            const newToken = await TokenService.getToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            }
          }
        } catch (refreshError) {
          console.error('Error al renovar token:', refreshError);
        }
      }
      
      // Si llegamos aquí, la renovación falló o no se pudo hacer
      await TokenService.removeToken();
      console.log('❌ Sesión expirada, token eliminado');
    }
    
    // Para otros errores, agregar información adicional de debug
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('Error de red - sin respuesta:', error.message);
    } else {
      // Error en la configuración de la petición
      console.error('Error de configuración:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;