import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Notificacion {
  id: number;
  tipo: string;
  mensaje: string;
  tiempo: string;
  leida: boolean;
  orden?: Record<string, unknown>;
}

interface Orden {
  id_orden: number;
  estado: string;
  [key: string]: unknown;
}

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Crear conexión Socket.io
    const socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    socketRef.current = socket;

    // Eventos de conexión
    socket.on('connect', () => {
      console.log('🔌 Conectado al servidor Socket.io');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Desconectado del servidor Socket.io');
      setIsConnected(false);
    });

    // Eventos de notificaciones
    socket.on('nuevaNotificacion', (notificacion: Notificacion) => {
      console.log('📨 Nueva notificación recibida via Socket.io:', notificacion);
      console.log('📨 ID de notificación:', notificacion.id);
      console.log('📨 Mensaje:', notificacion.mensaje);
      setNotificaciones(prev => {
        console.log('📨 Notificaciones anteriores:', prev.length);
        const nuevas = [notificacion, ...prev];
        console.log('📨 Notificaciones después de agregar:', nuevas.length);
        return nuevas;
      });
    });

    // Eventos de órdenes
    socket.on('ordenActualizada', (orden: Orden) => {
      console.log('📦 Orden actualizada recibida:', orden);
      setOrdenes(prev => 
        prev.map(o => o.id_orden === orden.id_orden ? orden : o)
      );
    });

    // Eventos de estadísticas
    socket.on('estadisticasActualizadas', (estadisticas: Record<string, unknown>) => {
      console.log('📊 Estadísticas actualizadas recibidas:', estadisticas);
      // Aquí puedes actualizar las estadísticas si las necesitas
    });

    // Limpiar al desmontar
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Función para emitir eventos (si es necesario)
  const emitEvent = (event: string, data: Record<string, unknown>) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  };

  // Función para unirse a salas específicas
  const joinRoom = (room: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join', room);
    }
  };

  return {
    isConnected,
    notificaciones,
    ordenes,
    emitEvent,
    joinRoom,
    socket: socketRef.current
  };
}; 