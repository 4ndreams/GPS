import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'operador' | 'vendedor' | 'user';
  avatar?: string;
  rut?: string;
  telefono?: string;
}

export interface LoginResponse {
  message: string;
  data: {
    token: string;
    user?: User;
  };
}

export const authService = {
  // Login con el backend de Ventas
  async login(credentials: LoginCredentials): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
    try {
      const response = await api.post<LoginResponse>('/login', credentials);
      
      if (response.data?.data?.token) {
        // Guardar el token en localStorage
        localStorage.setItem('token', response.data.data.token);
        
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        error: 'Respuesta inválida del servidor'
      };
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Extraer mensaje de error más específico
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Error de conexión con el servidor';
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar datos locales siempre
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
  },

  // Verificar token
  async verifyToken(): Promise<{ valid: boolean; user?: User }> {
    try {
      const response = await api.get('/token-info');
      
      if (response.data?.data) {
        return {
          valid: true,
          user: response.data.data
        };
      }
      
      return { valid: false };
    } catch (error) {
      console.error('Error verificando token:', error);
      return { valid: false };
    }
  },

  // Refresh token
  async refreshToken(): Promise<{ success: boolean; token?: string }> {
    try {
      const response = await api.post('/refresh-token');
      
      if (response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        return {
          success: true,
          token: response.data.data.token
        };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Error renovando token:', error);
      return { success: false };
    }
  },

  // Obtener usuarios
  async getUsers(): Promise<{ success: boolean; data?: User[]; error?: string }> {
    try {
      const response = await api.get('/users');
      
      if (response.data?.data) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: false,
        error: 'No se pudieron obtener los usuarios'
      };
    } catch (error: any) {
      console.error('Error obteniendo usuarios:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Error de conexión con el servidor';
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
};
