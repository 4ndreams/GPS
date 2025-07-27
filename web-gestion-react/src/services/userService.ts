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

// Tipo de respuesta para operaciones de usuario
export interface UserServiceResponse<T = User> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

// Función para mapear roles del backend al frontend
const mapRoleFromBackend = (backendRole: string): User['rol'] => {
  switch (backendRole) {
    case 'tienda':
      return 'tienda';
    case 'administrador':
    case 'fabrica':
    case 'cliente':
      return backendRole as User['rol'];
    default:
      return 'cliente';
  }
};

// Función para mapear roles del frontend al backend
const mapRoleToBackend = (frontendRole: User['rol']): string => {
  switch (frontendRole) {
    case 'tienda':
      return 'tienda';
    case 'administrador':
    case 'fabrica':
    case 'cliente':
      return frontendRole;
    default:
      return 'cliente';
  }
};

// Función para limpiar RUT (remover puntos, mantener guión)
const cleanRut = (rut: string): string => {
  if (!rut) return rut;
  // Remover puntos pero mantener guión y números
  return rut.replace(/\./g, '');
};

// Función para transformar un usuario del backend al frontend
const transformUserFromBackend = (backendUser: any): User => {
  return {
    ...backendUser,
    rol: mapRoleFromBackend(backendUser.rol),
    rut: backendUser.rut ? cleanRut(backendUser.rut) : backendUser.rut
  };
};

// Función para transformar un usuario del frontend al backend
const transformUserToBackend = (frontendUser: Partial<User>, includeId: boolean = false): any => {
  // Eliminar todos los campos de ID y campos calculados (excepto id_usuario si se solicita)
  const { 
    id_usuario, 
    id, // También eliminar 'id' si existe
    estado, 
    avatar, 
    fechaCreacion, 
    ultimaActividad,
    correoVerificado,
    createdAt,
    updatedAt,
    intentosFallidos,
    fechaBloqueo,
    ...userDataWithoutCalculatedFields 
  } = frontendUser as any;
  
  const result = {
    ...userDataWithoutCalculatedFields,
    rol: frontendUser.rol ? mapRoleToBackend(frontendUser.rol) : undefined
  };
  
  // Incluir id_usuario solo si se solicita explícitamente
  if (includeId && id_usuario) {
    result.id_usuario = id_usuario;
  }
  
  return result;
};

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
          data: response.data.data.map(transformUserFromBackend)
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
      // Usar la ruta que funciona (/users) y filtrar en el frontend
      const response = await api.get('/users');
      
      if (response.data?.data && Array.isArray(response.data.data)) {
        // Buscar el usuario específico en el array
        const userArray = response.data.data;
        const targetUser = userArray.find((user: any) => user.id_usuario?.toString() === id.toString());
        
        if (targetUser) {
          const transformedUser = transformUserFromBackend(targetUser);
          
          return {
            success: true,
            data: transformedUser
          };
        } else {
          return {
            success: false,
            error: 'Usuario no encontrado'
          };
        }
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
  async updateUser(id: string, userData: Partial<User>): Promise<UserServiceResponse<User>> {
    try {
      // Transformar los datos al formato del backend antes de enviar
      const backendUserData = transformUserToBackend(userData);
      
      // Usar la ruta correcta con el parámetro id_usuario
      const response = await api.patch(`/users/detail/${id}`, backendUserData);
      
      if (response.data?.data) {
        return {
          success: true,
          data: transformUserFromBackend(response.data.data)
        };
      }
      
      return {
        success: true,
        data: transformUserFromBackend(response.data)
      };
    } catch (error: any) {
      console.error('Error actualizando usuario:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Error de conexión con el servidor';
      // Extraer detalles del error si están disponibles
      const errorDetails = error.response?.data?.details || null;
      
      return {
        success: false,
        error: errorMessage,
        details: errorDetails
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
      await api.delete(`/users/detail/${id}`);
      
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
  },

  // Crear nuevo usuario (requiere admin)
  async createUser(userData: Partial<User>): Promise<UserServiceResponse<User>> {
    try {
      // Transformar los datos al formato del backend antes de enviar
      const backendUserData = transformUserToBackend(userData);
      
      const response = await api.post('/users', backendUserData);
      
      if (response.data?.data) {
        return {
          success: true,
          data: transformUserFromBackend(response.data.data)
        };
      }
      
      return {
        success: true,
        data: transformUserFromBackend(response.data)
      };
    } catch (error: any) {
      console.error('Error creando usuario:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Error de conexión con el servidor';
      
      // Extraer detalles del error si están disponibles
      const errorDetails = error.response?.data?.details || null;
      
      return {
        success: false,
        error: errorMessage,
        details: errorDetails
      };
    }
  }
};
