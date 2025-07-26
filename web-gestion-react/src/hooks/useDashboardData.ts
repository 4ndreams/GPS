import { useState, useEffect } from 'react';
import { getOrdenes } from '../services/ordenService';
import { getNotificaciones } from '../services/notificacionService';
import type { Orden } from '../services/ordenService';
import type { Notificacion } from '../services/notificacionService';

interface DashboardData {
  ordenes: Orden[];
  notificaciones: Notificacion[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useDashboardData = (): DashboardData => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener órdenes y notificaciones en paralelo
      const [ordenesResponse, notificacionesResponse] = await Promise.all([
        getOrdenes(),
        getNotificaciones()
      ]);

      if (ordenesResponse.success) {
        setOrdenes(ordenesResponse.data);
      } else {
        console.error('Error obteniendo órdenes:', ordenesResponse.message);
        // Si no hay datos del backend, mostrar array vacío
        setOrdenes([]);
      }

      if (notificacionesResponse.success) {
        setNotificaciones(notificacionesResponse.data);
      } else {
        console.error('Error obteniendo notificaciones:', notificacionesResponse.message);
        // Si no hay datos del backend, mostrar array vacío
        setNotificaciones([]);
      }

    } catch (err) {
      console.error('Error cargando datos del dashboard:', err);
      setError('Error al cargar los datos');
      // En caso de error, mostrar arrays vacíos
      setOrdenes([]);
      setNotificaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Polling para actualizar notificaciones cada 30 segundos
    const interval = setInterval(() => {
      console.log('🔄 Actualizando notificaciones automáticamente...');
      fetchData();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  const refresh = () => {
    fetchData();
  };

  return {
    ordenes,
    notificaciones,
    loading,
    error,
    refresh
  };
};
