/**
 * Servicio para manejar emisiones de Socket.io
 */

export const emitNotificacion = (notificacion) => {
  try {
    if (global.io) {
      global.io.to('notificaciones').emit('nuevaNotificacion', {
        ...notificacion,
        timestamp: new Date().toISOString()
      });
      console.log(`📡 Notificación emitida via Socket.io: ${notificacion.tipo}`);
    } else {
      console.warn('⚠️ Socket.io no está disponible');
    }
  } catch (error) {
    console.error('❌ Error emitiendo notificación via Socket.io:', error);
  }
};

export const emitOrdenActualizada = (orden) => {
  try {
    if (global.io) {
      global.io.to('notificaciones').emit('ordenActualizada', {
        ...orden,
        timestamp: new Date().toISOString()
      });
      console.log(`📡 Orden actualizada emitida via Socket.io: ${orden.id_orden}`);
    } else {
      console.warn('⚠️ Socket.io no está disponible');
    }
  } catch (error) {
    console.error('❌ Error emitiendo orden actualizada via Socket.io:', error);
  }
};

export const emitEstadisticasActualizadas = (estadisticas) => {
  try {
    if (global.io) {
      global.io.to('notificaciones').emit('estadisticasActualizadas', {
        ...estadisticas,
        timestamp: new Date().toISOString()
      });
      console.log('📡 Estadísticas actualizadas emitidas via Socket.io');
    } else {
      console.warn('⚠️ Socket.io no está disponible');
    }
  } catch (error) {
    console.error('❌ Error emitiendo estadísticas via Socket.io:', error);
  }
}; 