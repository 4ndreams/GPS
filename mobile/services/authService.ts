import api from './api'; // instancia de axios configurada con interceptores
import { TokenService } from './tokenService';
import { config } from './config';
import { Alert } from 'react-native';

// Función para iniciar sesión con email y contraseña
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/login', { 
      email, 
      password 
      //token 
    });

    if (response.data.data.token) {
      // Usar el sistema de gestión de tokens
      await TokenService.setToken(response.data.data.token);
      console.log('✅ Token guardado exitosamente');
      
      // Verificar que se guardó correctamente
      const savedToken = await TokenService.getToken();
      if (savedToken) {
        console.log('✅ Token verificado en almacenamiento');
      } else {
        console.log('❌ Error: Token no se guardó correctamente');
      }
    } else {
      console.log('❌ No se recibió token en la respuesta');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error("❌ Error en el inicio de sesión:", error);
    throw error;
  }
};

// Función para registrar usuarios
export const registerUser = async (userData: {
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/register', {
      nombre: userData.nombres,
      apellidos: userData.apellidos,
      rut: userData.rut,
      email: userData.email,
      password: userData.password,
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error en el registro:", error.response?.data ?? error.message);
    throw error;
  }
};

// Obtener URL de Google
export const getGoogleAuthUrl = () => {
  return `${config.API_BASE_URL}/auth/google`;
};

// Simulación de login con Google (para desarrollo)
export const loginWithGoogle = async () => {
  // En desarrollo, simular un login exitoso
  if (config.IS_DEV) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      user: {
        id_usuario: 999,
        email: 'test@google.com',
        nombre: 'Usuario Google',
        rol: 'admin'
      },
      token: 'mock_google_token_' + Date.now()
    };
  }
  
  throw new Error("Login con Google no implementado para producción");
};

// Simulación de login con Facebook
export const loginWithFacebook = async () => {
  // En desarrollo, simular un login exitoso
  if (config.IS_DEV) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      user: {
        id_usuario: 998,
        email: 'test@facebook.com',
        nombre: 'Usuario Facebook',
        rol: 'tienda'
      },
      token: 'mock_facebook_token_' + Date.now()
    };
  }
  
  throw new Error("Login con Facebook no implementado para producción");
};

// Verificar email
export const verifyEmail = async (token: string) => {
  try {
    return await api.get('/verify-email', { params: { token } });
  } catch (error: any) {
    console.error("❌ Error en verificación de email:", error.response?.data ?? error.message);
    throw error;
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    // Llamar al endpoint de logout en el backend
    await TokenService.logoutFromBackend();
  } catch (error: any) {
    console.error("Error en logout:", error.response?.data ?? error.message);
    // Aún así limpiamos el token local
    await TokenService.removeToken();
    throw error;
  }
};
