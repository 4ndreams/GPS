import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Si está autenticado, redirigir a los tabs
        router.replace('/(tabs)');
      } else {
        // Si no está autenticado, redirigir al login
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar loading mientras se verifica el estado de autenticación
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  // Este componente no debería renderizar nada más que el loading
  return null;
}