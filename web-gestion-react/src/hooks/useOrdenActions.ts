import { useCallback } from 'react';

interface OrdenDespacho {
  id: string;
  fecha: string;
  trabajadorFabrica: string;
  estado: string;
  prioridad: string;
  totalProductos: number;
  valorTotal: number;
  vendedora?: string;
}

export function useOrdenActions() {
  const marcarComoCompletada = useCallback(async (orden: OrdenDespacho) => {
    try {
      console.log('🔧 Marcando orden como completada:', orden.id);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`http://localhost:3000/api/orden/${orden.id}/completada`, {
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
        throw new Error('Error al marcar orden como completada');
      }

      const result = await response.json();
      console.log('✅ Orden marcada como completada:', orden.id, 'Resultado:', result);
      
      return result;
    } catch (err) {
      console.error('Error marcando orden como completada:', err);
      throw err;
    }
  }, []);

  const cancelarOrden = useCallback(async (orden: OrdenDespacho) => {
    try {
      console.log('🔧 Cancelando orden:', orden.id);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`http://localhost:3000/api/orden/${orden.id}/cancelada`, {
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
        throw new Error('Error al cancelar orden');
      }

      const result = await response.json();
      console.log('✅ Orden cancelada:', orden.id, 'Resultado:', result);
      
      return result;
    } catch (err) {
      console.error('Error cancelando orden:', err);
      throw err;
    }
  }, []);

  const verDetalles = useCallback((orden: OrdenDespacho) => {
    console.log('🔍 Ver detalles de orden:', orden);
    // Esta función ahora será manejada por el componente padre
    // que mostrará el modal
  }, []);

  return {
    marcarComoCompletada,
    cancelarOrden,
    verDetalles
  };
} 