import { useState, useEffect } from 'react';
import { getOrdenes } from '../services/ordenService';
import { getNotificaciones } from '../services/notificacionService';
import type { Orden } from '../services/ordenService';
import type { Notificacion } from '../services/notificacionService';
import { useSocket } from './useSocket';

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
  
  // Usar Socket.io para actualizaciones en tiempo real
  const { isConnected, notificaciones: socketNotificaciones } = useSocket();

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
    
    // Solo usar polling si no hay conexión Socket.io
    let interval: NodeJS.Timeout | null = null;
    
    if (!isConnected) {
      interval = setInterval(() => {
        console.log('🔄 Actualizando notificaciones automáticamente (polling)...');
        fetchData();
      }, 30000); // 30 segundos
    } else {
      console.log('🔌 Usando Socket.io para actualizaciones en tiempo real');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  // Actualizar notificaciones cuando lleguen por Socket.io
  useEffect(() => {
    if (socketNotificaciones.length > 0) {
      console.log('📨 Notificaciones recibidas via Socket.io:', socketNotificaciones.length);
      // Recargar datos cuando lleguen notificaciones nuevas
      fetchData();
    }
  }, [socketNotificaciones]);

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
