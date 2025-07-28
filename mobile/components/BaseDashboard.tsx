import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUsuario } from '../contexts/UsuarioContext';
import { DashboardConfig, PerfilType } from '../config/dashboardConfig';
import { useDashboardData } from '../hooks/useDashboardData';
import { CounterSection } from './CounterSection';
import { TabNavigation } from './TabNavigation';

interface BaseDashboardProps {
  perfil: PerfilType;
  config: DashboardConfig;
  data?: any;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => Promise<void>;
  renderContent: (
    activeTab: string,
    data: any,
    loading: boolean
  ) => React.ReactNode;
  floatingButton?: React.ReactNode;
  initialTab?: string;
}

export const BaseDashboard: React.FC<BaseDashboardProps> = ({
  perfil,
  config,
  data: externalData,
  loading: externalLoading,
  refreshing: externalRefreshing,
  onRefresh: externalOnRefresh,
  renderContent,
  floatingButton,
  initialTab,
}) => {
  const { usuario } = useUsuario();
  const [activeTab, setActiveTab] = useState(initialTab || config.tabs[0]?.key || '');
  
  // Usar datos externos si están disponibles, sino usar internos
  const internalDashboard = useDashboardData(config);
  const data = externalData ?? internalDashboard.data;
  const loading = externalLoading ?? internalDashboard.loading;
  const refreshing = externalRefreshing ?? internalDashboard.refreshing;
  const onRefresh = externalOnRefresh ?? internalDashboard.onRefresh;

  // Verificación de permisos
  if (usuario.perfil !== perfil) {
    return (
      <View style={styles.container}>
        <View style={styles.noPermissionContainer}>
          <Ionicons name="ban" size={64} color="#DC2626" />
          <Text style={styles.noPermissionTitle}>Acceso Denegado</Text>
          <Text style={styles.noPermissionText}>
            Esta función solo está disponible para el perfil de {perfil === 'fabrica' ? 'Fábrica' : 'Ventas/Tienda'}.
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={config.colors.primary} />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: config.colors.primary }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{config.title}</Text>
            <Text style={styles.headerSubtitle}>{usuario.nombre}</Text>
          </View>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contadores principales */}
      <CounterSection
        config={config}
        data={data}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tabs */}
      <TabNavigation
        config={config}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Contenido principal */}
      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderContent(activeTab, data, loading)}
      </ScrollView>

      {/* Botón flotante opcional */}
      {floatingButton}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    color: '#666',
    marginTop: 10,
    fontSize: 16,
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noPermissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 20,
    marginBottom: 10,
  },
  noPermissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    paddingTop: 50, // Reducido para móviles
    paddingBottom: 16, // Reducido para móviles
    paddingHorizontal: 16, // Reducido para móviles
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18, // Reducido para móviles
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12, // Reducido para móviles
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 16, // Reducido para móviles
  },
});
