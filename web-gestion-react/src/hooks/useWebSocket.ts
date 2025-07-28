import { useEffect, useRef, useCallback, useState } from 'react';

interface WebSocketEvent {
  tipo: string;
  mensaje: string;
  ordenId?: string;
  prioridad: string;
  timestamp: string;
}

interface OrdenActualizadaEvent {
  id_orden: number;
  estado: string;
  prioridad: string;
  timestamp: string;
}

export const useWebSocket = (
  onOrdenActualizada?: (orden: OrdenActualizadaEvent) => void,
  onNuevaNotificacion?: (notificacion: WebSocketEvent) => void
) => {
  const socketRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Memoizar los callbacks para evitar reconexiones
  const handleOrdenActualizada = useCallback((orden: OrdenActualizadaEvent) => {
    console.log('📡 Orden actualizada recibida:', orden);
    onOrdenActualizada?.(orden);
  }, [onOrdenActualizada]);

  const handleNuevaNotificacion = useCallback((notificacion: WebSocketEvent) => {
    console.log('📡 Nueva notificación recibida:', notificacion);
    onNuevaNotificacion?.(notificacion);
  }, [onNuevaNotificacion]);

  useEffect(() => {
    // Solo conectar si no está ya conectado
    if (socketRef.current?.connected) {
      return;
    }

    const connectWebSocket = async () => {
      try {
        // Importar socket.io-client dinámicamente
        const { io } = await import('socket.io-client');
        
        socketRef.current = io('http://localhost:3000', {
          transports: ['websocket', 'polling'],
          autoConnect: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5
        });

        // Unirse al room de notificaciones
        socketRef.current.emit('join', 'notificaciones');

        // Escuchar eventos
        socketRef.current.on('connect', () => {
          console.log('🔌 Conectado al WebSocket');
          setIsConnected(true);
        });

        socketRef.current.on('disconnect', () => {
          console.log('🔌 Desconectado del WebSocket');
          setIsConnected(false);
        });

        socketRef.current.on('ordenActualizada', handleOrdenActualizada);

        socketRef.current.on('nuevaNotificacion', handleNuevaNotificacion);

        socketRef.current.on('estadisticasActualizadas', (estadisticas: any) => {
          console.log('📡 Estadísticas actualizadas recibidas:', estadisticas);
        });

        socketRef.current.on('connect_error', (error: any) => {
          console.error('❌ Error de conexión WebSocket:', error);
          setIsConnected(false);
        });

      } catch (error) {
        console.error('❌ Error conectando al WebSocket:', error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.off('ordenActualizada', handleOrdenActualizada);
        socketRef.current.off('nuevaNotificacion', handleNuevaNotificacion);
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [handleOrdenActualizada, handleNuevaNotificacion]);

  return {
    socket: socketRef.current,
    isConnected
  };
}; 