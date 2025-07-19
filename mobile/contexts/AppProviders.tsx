import React, { ReactNode, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { UsuarioProvider, useUsuario } from './UsuarioContext';

interface AuthWrapperProps {
  children: ReactNode;
}

// Componente interno que sincroniza Auth con Usuario
const AuthSyncWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { usuario, cambiarPerfil, limpiarPerfil } = useUsuario();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Sincronizar el perfil cuando hay un usuario autenticado
      let perfil: 'fabrica' | 'tienda' | null = null;
      
      if (user.rol === 'admin') {
        perfil = 'fabrica';
      } else if (user.rol === 'tienda') {
        perfil = 'tienda';
      } else if (user.rol === 'fabrica') {
        perfil = 'fabrica';
      }

      // Solo cambiar si es diferente al actual
      if (perfil && perfil !== usuario.perfil) {
        cambiarPerfil(perfil, user.name);
      }
    } else if (!isAuthenticated && usuario.perfil !== null) {
      // Solo limpiar si hay un perfil establecido
      limpiarPerfil();
    }
  }, [isAuthenticated, user, usuario.perfil, cambiarPerfil, limpiarPerfil]);

  return <>{children}</>;
};

// Componente principal que provee ambos contextos
export const AppProviders: React.FC<AuthWrapperProps> = ({ children }) => {
  return (
    <AuthProvider>
      <UsuarioProvider>
        <AuthSyncWrapper>
          {children}
        </AuthSyncWrapper>
      </UsuarioProvider>
    </AuthProvider>
  );
};
