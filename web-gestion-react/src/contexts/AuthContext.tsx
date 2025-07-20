import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';

// Tipos
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'administrador' | 'fabrica' | 'tienda' | 'cliente';
  avatar?: string;
  rut?: string;
  telefono?: string;
}

// Función para mapear roles del backend al frontend
const mapRoleFromBackend = (backendRole: string): Usuario['rol'] => {
  switch (backendRole) {
    case 'tienda':
      return 'tienda';
    case 'administrador':
    case 'fabrica':
    case 'cliente':
      return backendRole as Usuario['rol'];
    default:
      return 'cliente';
  }
};

// Función para mapear roles del frontend al backend
export const mapRoleToBackend = (frontendRole: Usuario['rol']): string => {
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

export interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

// Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    try {
      const result = await authService.login({ email, password });

      if (result.success && result.data) {
        // Intentar obtener información completa del usuario
        const tokenInfo = await authService.verifyToken();
        
        let usuario: Usuario;
        
        if (tokenInfo.valid && tokenInfo.user) {
          // Si tenemos información del usuario desde el backend
          const tokenUser = tokenInfo.user as any;
          const backendUser = tokenUser.user || tokenUser;
          
          const userRole = backendUser.rol || 'cliente';
          const mappedRole = mapRoleFromBackend(userRole);
          
          usuario = {
            id: backendUser.id || Date.now().toString(),
            nombre: backendUser.nombreCompleto || backendUser.nombre || email.split('@')[0],
            email: backendUser.email || email,
            rol: mappedRole,
            avatar: backendUser.avatar,
            rut: backendUser.rut,
            telefono: backendUser.telefono,
          };
        } else {
          // Fallback con datos básicos
          usuario = {
            id: Date.now().toString(),
            nombre: email.split('@')[0],
            email: email,
            rol: 'cliente',
          };
        }

        setUsuario(usuario);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('usuario', JSON.stringify(usuario));
        
        return true;
      } else {
        console.log('Error en login:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUsuario(null);
    }
  };

  // Restaurar sesión al cargar la app
  React.useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        setUsuario(usuario);
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        localStorage.removeItem('usuario');
      }
    }
  }, []);

  const value = React.useMemo(() => ({
    usuario,
    isAuthenticated: !!usuario,
    login,
    logout,
    loading
  }), [usuario, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
