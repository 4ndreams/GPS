import { Tabs } from 'expo-router';
import { useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
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

  // Botón de añadir minuta
  const renderAddIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Ionicons name="add-circle-outline" size={size} color={color} />
    ),
    []
  );

// Botón de listado de minutas
  const renderListIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Ionicons name="document-text-outline" size={size} color={color} />
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
          tabBarAccessibilityLabel: 'Página principal', // Mejora accesibilidad
        }}
      />
      <Tabs.Screen
        name="crear-minuta"
        options={{
          title: 'Nueva Minuta',
          tabBarIcon: renderAddIcon,
          tabBarAccessibilityLabel: 'Crear nueva minuta',
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Acerca de',
          tabBarIcon: renderAboutIcon, // Reutilizando el icono de inicio
          tabBarAccessibilityLabel: 'Información sobre la aplicación',
        }}
      />
      {/* 
      <Tabs.Screen
        name="list"
        options={{
          title: 'Minutas',
          tabBarIcon: renderListIcon,
          tabBarAccessibilityLabel: 'Listado de minutas',
        }}
      />*/}
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