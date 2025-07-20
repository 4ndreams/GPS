import React, { ReactNode, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { UsuarioProvider, useUsuario } from './UsuarioContext';

interface AuthWrapperProps {
  children: ReactNode;
}

// Componente interno que sincroniza Auth con Usuario
const AuthSyncWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { cambiarPerfil, limpiarPerfil } = useUsuario();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Sincronizar el perfil cuando hay un usuario autenticado
      const perfil = user.perfil === 'admin' ? 'fabrica' : (user.perfil as 'fabrica' | 'tienda' | null);
      if (perfil) {
        cambiarPerfil(perfil, user.name);
      }
    } else {
      // Limpiar perfil cuando no hay usuario autenticado
      limpiarPerfil();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]); // cambiarPerfil y limpiarPerfil están memoizados con useCallback

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
