import axios from 'axios';
import { Platform } from 'react-native';
import { TokenService } from './tokenService';
import { router } from 'expo-router';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor request
api.interceptors.request.use(
  async (config) => {
    const token = await TokenService.getToken();
    console.log('🔑 Token obtenido:', token ? 'SÍ' : 'NO');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token enviado en headers:', config.headers.Authorization ? 'SÍ' : 'NO');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log('❌ Error de respuesta:', error.response?.status, error.response?.data);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const renewed = await TokenService.refreshTokenManually();
        if (renewed) {
          const newToken = await TokenService.getToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
      } catch (err) {
        console.error('Error al renovar token:', err);
      }

      // Si no se pudo renovar el token, limpiar y redirigir al login
      await TokenService.removeToken();
      console.log('❌ Token eliminado por sesión expirada');
      
      // Redirigir al login de forma más simple
      try {
        router.replace('/login');
      } catch (routerError) {
        console.error('Error al redirigir al login:', routerError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
