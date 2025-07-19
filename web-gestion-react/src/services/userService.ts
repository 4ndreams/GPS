import api from './api';

export interface User {
  id_usuario: string;
  nombre: string;
  apellidos?: string;
  email: string;
  rol: 'cliente' | 'fabrica' | 'tienda' | 'administrador';
  rut?: string;
  flag_blacklist?: boolean;
  correoVerificado?: boolean;
  createdAt?: string;
  updatedAt?: string;
  intentosFallidos?: number;
  fechaBloqueo?: string;
  // Campos calculados o derivados
  estado?: 'activo' | 'inactivo';
  avatar?: string;
  telefono?: string;
  fechaCreacion?: string;
  ultimaActividad?: string;
}

export interface UserProfile {
  id_usuario: string;
  nombre: string;
  apellidos?: string;
  email: string;
  rol: string;
  rut?: string;
  avatar?: string;
  telefono?: string;
}

export interface UserActivity {
  id: string;
  usuario_id: string;
  accion: string;
  descripcion: string;
  fecha: string;
  ip?: string;
}

export const userService = {
  // Obtener todos los usuarios (requiere admin)
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
  },

  // Obtener un usuario específico por ID (requiere admin)
  async getUser(id: string): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const response = await api.get(`/users?id_usuario=${id}`);
      
      if (response.data?.data) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    } catch (error: any) {
      console.error('Error obteniendo usuario:', error);
      
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

  // Obtener perfil del usuario logueado
  async getProfile(): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
    try {
      const response = await api.get('/users/profile');
      
      if (response.data?.data) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: false,
        error: 'No se pudo obtener el perfil'
      };
    } catch (error: any) {
      console.error('Error obteniendo perfil:', error);
      
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

  // Actualizar usuario específico (requiere admin)
  async updateUser(id: string, userData: Partial<User>): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const response = await api.patch(`/users?id_usuario=${id}`, userData);
      
      if (response.data?.data) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error actualizando usuario:', error);
      
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

  // Actualizar perfil del usuario logueado
  async updateProfile(profileData: Partial<UserProfile>): Promise<{ success: boolean; data?: UserProfile; error?: string }> {
    try {
      const response = await api.patch('/users/profile/edit', profileData);
      
      if (response.data?.data) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      
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

  // Eliminar usuario (requiere admin)
  async deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await api.delete(`/users?id_usuario=${id}`);
      
      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error eliminando usuario:', error);
      
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

  // Obtener actividad de un usuario (requiere admin)
  async getUserActivity(id: string): Promise<{ success: boolean; data?: UserActivity[]; error?: string }> {
    try {
      const response = await api.get(`/users/detail/${id}/activity`);
      
      if (response.data?.data) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: false,
        error: 'No se pudo obtener la actividad del usuario'
      };
    } catch (error: any) {
      console.error('Error obteniendo actividad del usuario:', error);
      
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
