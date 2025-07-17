import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('auth_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validación simple para demo
      if (email === 'admin@mundogestion.com' && password === '123456') {
        const userData: AuthUser = {
          id: '1',
          email: email,
          name: 'Administrador',
          avatar: 'https://ui-avatars.com/api/?name=Admin&background=DC2626&color=fff'
        };
        
        await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
        setUser(userData);
        return true;
      } else if (email === 'fabrica@mundogestion.com' && password === '123456') {
        const userData: AuthUser = {
          id: '2',
          email: email,
          name: 'Operador Fábrica',
          avatar: 'https://ui-avatars.com/api/?name=Fabrica&background=DC2626&color=fff'
        };
        
        await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
        setUser(userData);
        return true;
      } else if (email === 'tienda@mundogestion.com' && password === '123456') {
        const userData: AuthUser = {
          id: '3',
          email: email,
          name: 'Vendedora Tienda',
          avatar: 'https://ui-avatars.com/api/?name=Tienda&background=DC2626&color=fff'
        };
        
        await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simular login con Google
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const userData: AuthUser = {
        id: 'google_' + Date.now(),
        email: 'usuario@gmail.com',
        name: 'Usuario Google',
        avatar: 'https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff'
      };
      
      await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData: AuthUser = {
        id: 'new_' + Date.now(),
        email: email,
        name: name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=DC2626&color=fff`
      };
      
      await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};