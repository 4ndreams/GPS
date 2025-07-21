import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// TokenService adaptado a plataforma
const TokenService = {
  async getToken() {
    if (Platform.OS === 'web') {
      return localStorage.getItem('token');
    } else {
      return await SecureStore.getItemAsync('token');
    }
  },
  async removeToken() {
    if (Platform.OS === 'web') {
      localStorage.removeItem('token');
    } else {
      await SecureStore.deleteItemAsync('token');
    }
  },
  async refreshTokenManually() {
    // Aquí deberías implementar la lógica para renovar el token.
    // Ej: llamar a /auth/refresh con refreshToken
    return false; // o true si se logró
  }
};

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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

      await TokenService.removeToken();
      console.log('❌ Token eliminado por sesión expirada');
    }

    return Promise.reject(error);
  }
);

export default api;
