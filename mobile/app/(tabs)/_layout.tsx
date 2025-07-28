import { Tabs } from 'expo-router';
import { useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUsuario } from '../../contexts/UsuarioContext';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { usuario } = useUsuario();
  // Separar los tabs: dashboards a la izquierda, home al centro, otros a la derecha
  const dashboardTabs = state.routes.filter((r) => r.name === 'dashboard-ventas' || r.name === 'dashboard-fabrica');
  const homeTab = state.routes.find((r) => r.name === 'home');
  const otherTabs = state.routes.filter((r) => r.name !== 'dashboard-ventas' && r.name !== 'dashboard-fabrica' && r.name !== 'home' && r.name !== 'index' && r.name !== 'crear-minuta');

  return (
    <View style={styles.tabBarContainer}>
      {/* Dashboards a la izquierda */}
      <View style={styles.tabGroupLeft}>
        {dashboardTabs.map((route, idx) => {
          if ((route.name === 'dashboard-ventas' && usuario.perfil !== 'tienda') || (route.name === 'dashboard-fabrica' && usuario.perfil !== 'fabrica')) return null;
          const { options } = descriptors[route.key];
          const isFocused = state.index === state.routes.findIndex((r) => r.key === route.key);
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabButton}
            >
              {options.tabBarIcon?.({ color: isFocused ? '#DC2626' : '#6B7280', size: 24, focused: isFocused })}
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{options.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Home al centro */}
      {homeTab && (
        <TouchableOpacity
          key={homeTab.key}
          accessibilityRole="button"
          accessibilityState={state.index === state.routes.findIndex((r) => r.key === homeTab.key) ? { selected: true } : {}}
          onPress={() => navigation.navigate(homeTab.name)}
          style={styles.tabButtonCenter}
        >
          {descriptors[homeTab.key].options.tabBarIcon?.({ color: state.index === state.routes.findIndex((r) => r.key === homeTab.key) ? '#DC2626' : '#6B7280', size: 32, focused: state.index === state.routes.findIndex((r) => r.key === homeTab.key) })}
          <Text style={[styles.tabLabel, state.index === state.routes.findIndex((r) => r.key === homeTab.key) && styles.tabLabelActive]}>Inicio</Text>
        </TouchableOpacity>
      )}
      {/* Otros tabs a la derecha */}
      <View style={styles.tabGroupRight}>
        {otherTabs.map((route, idx) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === state.routes.findIndex((r) => r.key === route.key);
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabButton}
            >
              {options.tabBarIcon && typeof options.tabBarIcon === 'function'
                ? options.tabBarIcon({ color: isFocused ? '#DC2626' : '#6B7280', size: 24, focused: isFocused })
                : null}
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{options.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    height: 60,
    paddingHorizontal: 16, // Aumentar el padding lateral
    justifyContent: 'space-between',
  },
  tabGroupLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16, // Separar del centro
    gap: 16, // Más espacio entre botones
  },
  tabGroupRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16, // Separar del centro
    gap: 16, // Más espacio entre botones
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  tabButtonCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 32,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#DC2626',
    fontWeight: 'bold',
  },
});

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



  // Botón de dashboard de ventas
  const renderSalesIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Ionicons name="storefront-outline" size={size} color={color} />
    ),
    []
  );

  // Botón de flujo de despacho
  const renderFactoryIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Ionicons name="cube-outline" size={size} color={color} />
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
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Pantalla index invisible para redirección */}
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarButton: () => null, // Ocultar del tab bar
        }}
      />
      
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: renderHomeIcon,
          tabBarAccessibilityLabel: 'Página principal',
        }}
      />
      
      {/* Tab para Dashboard de Ventas */}
      <Tabs.Screen
        name="dashboard-ventas"
        options={{
          title: 'Dashboard Ventas',
          tabBarIcon: renderSalesIcon,
          tabBarAccessibilityLabel: 'Dashboard de ventas',
          // Ocultar del tab bar si no es perfil de tienda
          tabBarButton: usuario.perfil === 'tienda' ? undefined : () => null,
        }}
      />

      {/* Tab para Flujo de Despacho */}
      <Tabs.Screen
        name="dashboard-fabrica"
        options={{
          title: 'Flujo despacho',
          tabBarIcon: renderFactoryIcon,
          tabBarAccessibilityLabel: 'Flujo despacho',
          // Ocultar del tab bar si no es perfil de fábrica
          tabBarButton: usuario.perfil === 'fabrica' ? undefined : () => null,
        }}
      />

      
      {/* Tab para crear minuta - OCULTO - no se usa actualmente */}
      <Tabs.Screen
        name="crear-minuta"
        options={{
          title: 'Nueva Minuta',
          tabBarIcon: renderAddIcon,
          tabBarAccessibilityLabel: 'Crear nueva minuta',
          // Completamente oculto del tab bar
          tabBarButton: () => null,
        }}
      />
      {/*
       Tab para revisar minutas - siempre presente pero oculto si no es tienda 
      <Tabs.Screen
        name="revisar-minuta"
        options={{
          title: 'Revisar Minutas',
          tabBarIcon: renderReviewIcon,
          tabBarAccessibilityLabel: 'Revisar minutas pendientes',
          // Ocultar del tab bar si no es perfil de tienda
          tabBarButton: usuario.perfil === 'tienda' ? undefined : () => null,
        }}
      />*/}

      {/* Eliminar el tab de Acerca de de la barra inferior */}
      {/* <Tabs.Screen
        name="about"
        options={{
          title: 'Acerca de',
          tabBarIcon: renderAboutIcon,
          tabBarAccessibilityLabel: 'Información sobre la aplicación',
        }}
      /> */}

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