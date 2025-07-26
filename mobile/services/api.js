import axios from 'axios';
import { TokenService } from './tokenService';

// Función de logging condicional para producción
const isDev = __DEV__;
const log = (message, ...args) => {
  if (isDev) {
    console.log(message, ...args);
  }
};

const api = axios.create({
  baseURL:  process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor request
api.interceptors.request.use(
  async (config) => {
    try {
      log('🔍 Verificando token para petición:', config.method?.toUpperCase(), config.url);
      const token = await TokenService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        log('🔐 Token añadido a la petición:', `Bearer ${token.substring(0, 20)}...`);
      } else {
        log('⚠️ No hay token disponible para la petición');
        log('🔍 Intentando verificar si el token se guardó recientemente...');
        
        // Pequeño delay para permitir que se complete el guardado del token
        await new Promise(resolve => setTimeout(resolve, 100));
        const tokenRetry = await TokenService.getToken();
        if (tokenRetry) {
          config.headers.Authorization = `Bearer ${tokenRetry}`;
          log('✅ Token encontrado en segundo intento:', `Bearer ${tokenRetry.substring(0, 20)}...`);
        } else {
          log('❌ Token definitivamente no disponible');
        }
      }
      log('📤 Petición:', config.method?.toUpperCase(), config.url);
      return config;
    } catch (error) {
      console.error('❌ Error en interceptor request:', error); // Mantener errores críticos
      return config;
    }
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
      log('❌ Error 401: Token inválido o expirado');
      
      await TokenService.removeToken();
      log('❌ Token eliminado por sesión expirada');
    }

    return Promise.reject(error);
  }
);

export default api;
