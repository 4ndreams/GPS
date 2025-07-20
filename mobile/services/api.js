import axios from 'axios';
import { Platform } from 'react-native';

// Función auxiliar para manejar el storage multiplataforma
const getSecureStore = () => {
  if (Platform.OS === 'web') {
    // Para web, usar localStorage
    return {
      getItemAsync: async (key) => {
        try {
          return localStorage.getItem(key);
        } catch {
          return null;
        }
      },
      setItemAsync: async (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch {
          // Ignorar errores de localStorage
        }
      },
      deleteItemAsync: async (key) => {
        try {
          localStorage.removeItem(key);
        } catch {
          // Ignorar errores de localStorage
        }
      }
    };
  } else {
    // Para móvil, usar expo-secure-store
    const SecureStore = require('expo-secure-store');
    return SecureStore;
  }
};

const secureStore = getSecureStore();

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await secureStore.getItemAsync('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('No se pudo obtener token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await secureStore.deleteItemAsync('token');
      } catch {
        // Ignorar errores al eliminar token
      }
      // Redirigir al login de tu app
    }
    return Promise.reject(error);
  }
);

export default api;