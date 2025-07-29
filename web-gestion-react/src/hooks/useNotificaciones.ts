import { useState, useEffect, useCallback } from 'react';

interface Notificacion {
  id: number | string;
  tipo: string;
  mensaje: string;
  tiempo: string;
  leida: boolean;
  orden?: string;
}

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotificacionesNoLeidas = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay token de autenticación');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notificaciones?soloNoLeidas=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener notificaciones');
      }

      const data = await response.json();
      setNotificaciones(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching notificaciones:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const marcarComoLeida = useCallback(async (notificacionId: number | string) => {
    try {
      console.log('🔧 Iniciando marcarComoLeida con ID:', notificacionId, 'Tipo:', typeof notificacionId);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay token de autenticación');
        return;
      }

      const url = `${import.meta.env.VITE_API_BASE_URL}/notificaciones/${notificacionId}/leida`;
      console.log('🌐 Haciendo PATCH a:', url);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error('Error al marcar notificación como leída');
      }

      const result = await response.json();
      console.log('✅ Notificación marcada como leída:', notificacionId, 'Resultado:', result);
      
      // Recargar las notificaciones no leídas después de marcar como leída
      await fetchNotificacionesNoLeidas();
    } catch (err) {
      console.error('Error marcando notificación como leída:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [fetchNotificacionesNoLeidas]);

  const marcarTodasComoLeidas = useCallback(async () => {
    try {
      console.log('🔧 Iniciando marcarTodasComoLeidas');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay token de autenticación');
        return;
      }

      const url = `${import.meta.env.VITE_API_BASE_URL}/notificaciones/todas/leidas`;
      console.log('🌐 Haciendo PATCH a:', url);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error('Error al marcar todas las notificaciones como leídas');
      }

      const result = await response.json();
      console.log('✅ Todas las notificaciones marcadas como leídas:', result);
      
      // Recargar las notificaciones no leídas después de marcar todas como leídas
      await fetchNotificacionesNoLeidas();
    } catch (err) {
      console.error('Error marcando todas las notificaciones como leídas:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [fetchNotificacionesNoLeidas]);

  // Filtrar solo notificaciones no leídas
  const notificacionesNoLeidas = notificaciones.filter(notif => !notif.leida);

  useEffect(() => {
    fetchNotificacionesNoLeidas();
  }, [fetchNotificacionesNoLeidas]);

  return {
    notificaciones,
    notificacionesNoLeidas,
    loading,
    error,
    marcarComoLeida,
    marcarTodasComoLeidas,
    refetch: fetchNotificacionesNoLeidas
  };
} 
