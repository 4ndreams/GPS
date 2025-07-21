import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Tipos
export type TipoPerfil = 'fabrica' | 'tienda' | null;

interface Usuario {
  perfil: TipoPerfil;
  nombre: string;
}

interface UsuarioContextType {
  usuario: Usuario;
  cambiarPerfil: (perfil: TipoPerfil, nombre?: string) => Promise<void>;
  limpiarPerfil: () => Promise<void>;
  loading: boolean;
}

// Context
const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

// Provider
interface UsuarioProviderProps {
  children: ReactNode;
}

export const UsuarioProvider: React.FC<UsuarioProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario>({
    perfil: 'tienda', // Perfil por defecto para testing
    nombre: 'Vendedora Tienda'
  });
  const loading = false; // Por ahora sin persistencia

  const cambiarPerfil = useCallback(async (perfil: TipoPerfil, nombre: string = ''): Promise<void> => {
    try {
      // Actualizar estado
      setUsuario({
        perfil,
        nombre
      });
      
      console.log('Perfil cambiado a:', perfil, nombre);
    } catch (error) {
      console.error('Error al cambiar perfil:', error);
    }
  }, []);

  const limpiarPerfil = useCallback(async (): Promise<void> => {
    try {
      setUsuario({
        perfil: null,
        nombre: ''
      });
      
      console.log('Perfil limpiado');
    } catch (error) {
      console.error('Error al limpiar perfil:', error);
    }
  }, []);

  const value: UsuarioContextType = {
    usuario,
    cambiarPerfil,
    limpiarPerfil,
    loading
  };

  return (
    <UsuarioContext.Provider value={value}>
      {children}
    </UsuarioContext.Provider>
  );
};

// Hook personalizado para usar el context
export const useUsuario = (): UsuarioContextType => {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error('useUsuario debe ser usado dentro de UsuarioProvider');
  }
  return context;
};
