// config.js - Configuración del entorno
import { Platform } from 'react-native';

// Detectar el entorno actual
const isDev = __DEV__;
const isWeb = Platform.OS === 'web';

// URLs base según el entorno
const API_URLS = {
  // Para desarrollo web (navegador)
  web: 'http://localhost:3000/api',
  
  // Para desarrollo móvil (necesitas usar tu IP local)
  // Reemplaza con tu IP local cuando pruebes en dispositivo
  mobile: 'http://192.168.1.105:3000/api', // Cambia esta IP
  
  // Para producción
  production: 'http://146.83.198.35:1237/api/'
};

// Seleccionar URL base apropiada
const getApiBaseUrl = () => {
  // Si hay variable de entorno, usarla
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  
  // Si no, seleccionar según entorno
  if (!isDev) {
    return API_URLS.production;
  }
  
  return isWeb ? API_URLS.web : API_URLS.mobile;
};

export const config = {
  API_BASE_URL: getApiBaseUrl(),
  IS_DEV: isDev,
  IS_WEB: isWeb,
  PLATFORM: Platform.OS,
  
  // Configuraciones adicionales
  TOKEN_DURATION: 24 * 60 * 60 * 1000, // 24 horas
  REQUEST_TIMEOUT: 10000, // 10 segundos
};
