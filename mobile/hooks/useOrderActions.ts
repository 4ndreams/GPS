import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import api from '../services/api';
import { ProcessingState } from '../types/dashboard';

export interface UseOrderActionsReturn {
  procesando: ProcessingState;
  cambiarEstado: (id_orden: number, nuevoEstado: string, additionalData?: any) => Promise<void>;
  confirmarRecepcion: (id_orden: number, conProblema: boolean, observaciones?: string) => Promise<void>;
  crearDespacho: (ordenes: number[], transportista: string, observaciones?: string) => Promise<void>;
}

export const useOrderActions = (onSuccess?: () => Promise<void>): UseOrderActionsReturn => {
  const [procesando, setProcesando] = useState<ProcessingState>({});

  const setProcessing = useCallback((id_orden: number, processing: boolean) => {
    setProcesando(prev => ({
      ...prev,
      [id_orden]: processing
    }));
  }, []);

  const cambiarEstado = useCallback(async (
    id_orden: number,
    nuevoEstado: string,
    additionalData?: any
  ) => {
    if (procesando[id_orden]) return;

    try {
      setProcessing(id_orden, true);
      console.log('🔄 Cambiando estado de orden', id_orden, 'a:', nuevoEstado);

      const updateData = {
        estado: nuevoEstado,
        ...additionalData
      };

      await api.put(`/orden/${id_orden}`, updateData);
      console.log('✅ Estado cambiado exitosamente');

      if (onSuccess) {
        console.log('🔃 Refrescando datos del dashboard...');
        await onSuccess();
        console.log('✅ Datos del dashboard refrescados');
      }

      const mensaje = getSuccessMessage(nuevoEstado);
      Alert.alert('Éxito', mensaje);
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error);
      Alert.alert('Error', 'No se pudo cambiar el estado de la orden');
    } finally {
      setProcessing(id_orden, false);
    }
  }, [procesando, onSuccess, setProcessing]);

  const confirmarRecepcion = useCallback(async (
    id_orden: number,
    conProblema: boolean = false,
    observaciones?: string
  ) => {
    const estadoFinal = conProblema ? 'Recibido con problemas' : 'Recibido';
    const additionalData = {
      fecha_entrega: new Date().toISOString(),
      observaciones: observaciones?.trim() || ''
    };

    await cambiarEstado(id_orden, estadoFinal, additionalData);
  }, [cambiarEstado]);

  const crearDespacho = useCallback(async (
    ordenesIds: number[],
    transportista: string,
    observaciones?: string
  ) => {
    if (ordenesIds.length === 0) {
      Alert.alert('Error', 'Debes seleccionar al menos una orden');
      return;
    }

    if (!transportista.trim()) {
      Alert.alert('Error', 'Debes indicar el nombre del transportista');
      return;
    }

    try {
      // Marcar todas las órdenes como procesando
      ordenesIds.forEach(id => setProcessing(id, true));

      const promises = ordenesIds.map(async (id_orden) => {
        try {
          // Obtener detalles de la orden
          const ordenResponse = await api.get(`/orden/${id_orden}`);
          const orden = ordenResponse.data.data;

          // Crear despacho
          const despachoData = {
            id_producto: orden.producto.id_producto,
            cantidad: orden.cantidad,
            estado: 'En tránsito',
            origen: 'Fábrica Principal',
            destino: 'Tienda',
            observaciones: `Transportista: ${transportista.trim()}${observaciones ? ` - ${observaciones.trim()}` : ''}`,
            id_usuario: 1, // ID temporal
            id_bodega: 1,
            id_orden_origen: orden.id_orden,
          };

          const despachoResponse =       await api.post('/despachos', despachoData);

          // Actualizar estado de la orden original
          await api.put(`/orden/${id_orden}`, {
            estado: 'Despachada'
          });

          return despachoResponse.data.data;
        } catch (error) {
          console.error(`Error procesando orden ${id_orden}:`, error);
          throw error;
        }
      });

      await Promise.all(promises);
      Alert.alert('Éxito', `Se crearon ${ordenesIds.length} despachos correctamente`);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error('Error al crear despachos:', error);
      Alert.alert('Error', 'No se pudieron crear todos los despachos');
    } finally {
      // Limpiar procesando
      ordenesIds.forEach(id => setProcessing(id, false));
    }
  }, [onSuccess, setProcessing]);

  return {
    procesando,
    cambiarEstado,
    confirmarRecepcion,
    crearDespacho,
  };
};

const getSuccessMessage = (estado: string): string => {
  switch (estado) {
    case 'En producción':
      return 'Orden iniciada en producción';
    case 'Fabricada':
      return 'Orden marcada como fabricada';
    case 'Recibido':
      return 'Recepción confirmada exitosamente';
    case 'Recibido con problemas':
      return 'Recepción confirmada con problemas reportados';
    case 'Despachada':
      return 'Orden despachada correctamente';
    default:
      return 'Estado actualizado correctamente';
  }
};
