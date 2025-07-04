import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

// Tipos
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'operador' | 'vendedor';
  avatar?: string;
}

export interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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

  // Simulación de usuarios para desarrollo
  const usuariosDemo = [
    {
      id: '1',
      nombre: 'Admin Sistema',
      email: 'admin@gps.com',
      password: 'admin123',
      rol: 'admin' as const,
      avatar: undefined
    },
    {
      id: '2',
      nombre: 'María López',
      email: 'maria@gps.com',
      password: 'maria123',
      rol: 'operador' as const,
      avatar: undefined
    },
    {
      id: '3',
      nombre: 'Carlos Ruiz',
      email: 'carlos@gps.com',
      password: 'carlos123',
      rol: 'vendedor' as const,
      avatar: undefined
    }
  ];

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    try {
      // Simulación de delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Buscar usuario en datos demo
      const usuarioEncontrado = usuariosDemo.find(
        u => u.email === email && u.password === password
      );

      if (usuarioEncontrado) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...usuarioSinPassword } = usuarioEncontrado;
        setUsuario(usuarioSinPassword);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('usuario', JSON.stringify(usuarioSinPassword));
        
        console.log('Login exitoso:', usuarioSinPassword);
        return true;
      } else {
        console.log('Credenciales inválidas');
        return false;
      }
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    console.log('Logout realizado');
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

  const value: AuthContextType = {
    usuario,
    isAuthenticated: !!usuario,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
