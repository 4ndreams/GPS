import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import api from '../services/api';
import { DashboardConfig } from '../config/dashboardConfig';
import { DashboardData, BaseOrden } from '../types/dashboard';

export interface UseDashboardDataReturn {
  data: DashboardData;
  loading: boolean;
  refreshing: boolean;
  loadData: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const useDashboardData = (config: DashboardConfig): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📊 Cargando datos del dashboard...');

      // Crear promesas para todos los endpoints
      const promises = config.counters.map(async (counter) => {
        try {
          console.log(`🔄 Cargando datos para ${counter.key}: ${counter.apiEndpoint}`);
          const response = await api.get(counter.apiEndpoint);
          console.log(`✅ Datos cargados para ${counter.key}:`, response.data.data?.length || 0, 'elementos');
          return {
            key: counter.key,
            data: response.data.data as BaseOrden[]
          };
        } catch (error: any) {
          console.error(`❌ Error loading data for ${counter.key}:`, {
            endpoint: counter.apiEndpoint,
            status: error.response?.status,
            statusText: error.response?.statusText,
            message: error.message
          });
          return {
            key: counter.key,
            data: [] as BaseOrden[]
          };
        }
      });

      // Ejecutar todas las promesas en paralelo
      const results = await Promise.all(promises);

      // Construir el objeto de datos
      const newData: DashboardData = {};
      results.forEach(result => {
        newData[result.key] = result.data;
      });

      setData(newData);
      console.log('✅ Datos del dashboard cargados:', Object.keys(newData).map(key => `${key}: ${newData[key].length}`));
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  }, [config.counters]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    refreshing,
    loadData,
    onRefresh,
  };
};
