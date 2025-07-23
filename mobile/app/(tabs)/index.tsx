import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useUsuario } from '../../contexts/UsuarioContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { usuario } = useUsuario();

  console.log('🎯 TabsIndex - Perfil actual:', usuario.perfil);

  useEffect(() => {
    console.log('🚀 TabsIndex useEffect - Perfil:', usuario.perfil);
    
    // Redirigir según el perfil del usuario
    if (usuario.perfil === 'fabrica') {
      console.log('📍 Redirigiendo a dashboard-fabrica');
      router.replace('/(tabs)/dashboard-fabrica');
    } else if (usuario.perfil === 'tienda') {
      console.log('📍 Redirigiendo a dashboard-ventas');
      router.replace('/(tabs)/dashboard-ventas');
    } else {
      console.log('📍 Redirigiendo a home');
      router.replace('/(tabs)/home');
    }
  }, [usuario.perfil, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#DC2626" />
    </View>
  );
}
