import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../services/authService';
import { TokenService } from '../services/tokenService';
import { Alert } from 'react-native';

interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  rol?: 'fabrica' | 'tienda' | 'admin';
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
      // Verificar si hay un token válido
      const token = await TokenService.getToken();
      if (token && await TokenService.isTokenValid()) {
        // Si hay token válido, obtener datos del usuario del almacenamiento
        const userData = await AsyncStorage.getItem('auth_user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } else {
        // Si no hay token válido, limpiar datos
        await TokenService.removeToken();
        await AsyncStorage.removeItem('auth_user');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      // En caso de error, limpiar datos por seguridad
      await TokenService.removeToken();
      await AsyncStorage.removeItem('auth_user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Llamar al servicio de autenticación real
      const response = await loginUser(email, password);
      //asegurarme que se envie
      Alert.alert('🔍 Respuesta del backend:', JSON.stringify(response));
      if (response) {
        // Extraer datos del usuario de la respuesta
        const userData: AuthUser = {
          id: response.user?.id_usuario?.toString() || 'unknown',
          email: response.user?.email || email,
          nombre: response.user?.nombre || 'Usuario',
          rol: response.user?.rol as 'fabrica' | 'tienda' | 'admin'
        };

        await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
        setUser(userData);
        console.log('✅ Login completado, usuario autenticado');
        
        // Pequeño delay para asegurar que el token esté disponible
        setTimeout(() => {
          console.log('🔄 Token debería estar disponible ahora');
        }, 200);
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      // Propagar el error para que el componente de login pueda manejarlo
      throw error;
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
        nombre: 'Usuario Google'
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
        nombre: name
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
      // Limpiar token del almacenamiento seguro
      await TokenService.removeToken();
      // Limpiar datos del usuario
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