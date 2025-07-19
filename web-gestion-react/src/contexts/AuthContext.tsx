import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';

// Tipos
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'operador' | 'vendedor' | 'user';
  avatar?: string;
  rut?: string;
  telefono?: string;
}

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
          usuario = {
            id: tokenInfo.user.id || Date.now().toString(),
            nombre: tokenInfo.user.nombre || email.split('@')[0],
            email: tokenInfo.user.email || email,
            rol: tokenInfo.user.rol || 'user',
            avatar: tokenInfo.user.avatar,
            rut: tokenInfo.user.rut,
            telefono: tokenInfo.user.telefono,
          };
        } else {
          // Fallback con datos básicos
          usuario = {
            id: Date.now().toString(),
            nombre: email.split('@')[0],
            email: email,
            rol: 'user',
          };
        }

        setUsuario(usuario);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('usuario', JSON.stringify(usuario));
        
        console.log('Login exitoso:', usuario);
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
      console.log('Logout realizado');
    }
  };

  // Restaurar sesión al cargar la app
  React.useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        setUsuario(usuario);
        console.log('Sesión restaurada:', usuario);
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
