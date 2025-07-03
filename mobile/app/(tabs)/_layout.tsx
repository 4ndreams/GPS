import { Tabs } from 'expo-router';
import { useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUsuario } from '../../contexts/UsuarioContext';

export default function TabLayout() {
  const { usuario } = useUsuario();
  
  // Memoizar iconos para mejorar rendimiento
  // y evitar recrearlos en cada renderizado

  // Botón de inicio
  const renderHomeIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Ionicons name="home-outline" size={size} color={color} />
    ),
    []
  );

  // Botón de información
  const renderAboutIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Ionicons name="information-circle-outline" size={size} color={color} />
    ),
    []
  );

  // Botón de añadir minuta (solo para fábrica)
  const renderAddIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Ionicons name="add-circle-outline" size={size} color={color} />
    ),
    []
  );

  // Botón de revisar minutas (solo para tienda)
  const renderReviewIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Ionicons name="checkmark-circle-outline" size={size} color={color} />
    ),
    []
  );

  // Botón de perfiles
  const renderProfileIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Ionicons name="person-outline" size={size} color={color} />
    ),
    []
  );

  return (
    <Tabs
      screenOptions={{
        // Colores directamente en el objeto
        tabBarActiveTintColor: '#DC2626', // Rojo
        tabBarInactiveTintColor: '#6B7280', // Gris
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // Blanco
          borderTopColor: '#E5E7EB', // Gris claro
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: renderHomeIcon,
          tabBarAccessibilityLabel: 'Página principal',
        }}
      />
      
      {/* Tab para crear minuta - siempre presente pero oculto si no es fábrica */}
      <Tabs.Screen
        name="crear-minuta"
        options={{
          title: 'Nueva Minuta',
          tabBarIcon: renderAddIcon,
          tabBarAccessibilityLabel: 'Crear nueva minuta',
          // Ocultar del tab bar si no es perfil de fábrica
          tabBarButton: usuario.perfil === 'fabrica' ? undefined : () => null,
        }}
      />
      
      {/* Tab para revisar minutas - siempre presente pero oculto si no es tienda */}
      <Tabs.Screen
        name="revisar-minuta"
        options={{
          title: 'Revisar Minutas',
          tabBarIcon: renderReviewIcon,
          tabBarAccessibilityLabel: 'Revisar minutas pendientes',
          // Ocultar del tab bar si no es perfil de tienda
          tabBarButton: usuario.perfil === 'tienda' ? undefined : () => null,
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: 'Acerca de',
          tabBarIcon: renderAboutIcon,
          tabBarAccessibilityLabel: 'Información sobre la aplicación',
        }}
      />
      
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: renderProfileIcon,
          tabBarAccessibilityLabel: 'Perfil de usuario',
        }}
      />
    </Tabs>
  );
}