import { useState, useEffect, useCallback } from 'react';
import { getNotificaciones, getNotificacionesNoLeidas, marcarNotificacionLeida } from '../services/notificacionService';
import type { Notificacion } from '../services/notificacionService';

interface UseNotificacionesReturn {
  notificaciones: Notificacion[];
  notificacionesNoLeidas: Notificacion[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  marcarComoLeida: (id: number) => Promise<void>;
  cantidadNoLeidas: number;
}

export const useNotificaciones = (): UseNotificacionesReturn => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotificaciones = useCallback(async () => {
    try {
      setError(null);
      
      const [todasResponse, noLeidasResponse] = await Promise.all([
        getNotificaciones(),
        getNotificacionesNoLeidas()
      ]);

      if (todasResponse.success) {
        setNotificaciones(todasResponse.data);
      } else {
        console.error('Error obteniendo todas las notificaciones:', todasResponse.message);
        setNotificaciones([]);
      }

      if (noLeidasResponse.success) {
        setNotificacionesNoLeidas(noLeidasResponse.data);
      } else {
        console.error('Error obteniendo notificaciones no leídas:', noLeidasResponse.message);
        setNotificacionesNoLeidas([]);
      }

    } catch (err) {
      console.error('Error cargando notificaciones:', err);
      setError('Error al cargar las notificaciones');
      setNotificaciones([]);
      setNotificacionesNoLeidas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const marcarComoLeida = useCallback(async (id: number) => {
    try {
      const result = await marcarNotificacionLeida(id);
      if (result.success) {
        // Actualizar el estado local
        setNotificaciones(prev => 
          prev.map(notif => 
            notif.id === id ? { ...notif, leida: true } : notif
          )
        );
        setNotificacionesNoLeidas(prev => 
          prev.filter(notif => notif.id !== id)
        );
      } else {
        console.error('Error marcando notificación como leída:', result.message);
      }
    } catch (err) {
      console.error('Error marcando notificación como leída:', err);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchNotificaciones();
  }, [fetchNotificaciones]);

  useEffect(() => {
    fetchNotificaciones();
    
    // Polling cada 30 segundos para notificaciones
    const interval = setInterval(() => {
      console.log('🔄 Actualizando notificaciones...');
      fetchNotificaciones();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotificaciones]);

  return {
    notificaciones,
    notificacionesNoLeidas,
    loading,
    error,
    refresh,
    marcarComoLeida,
    cantidadNoLeidas: notificacionesNoLeidas.length
  };
}; 