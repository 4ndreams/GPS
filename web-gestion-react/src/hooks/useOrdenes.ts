import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

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

interface OrdenBackend {
  id_orden: number;
  id: number; 
  cantidad: number;
  total: string;
  origen: string;
  destino: string;
  fecha_envio: string;
  fecha_entrega: string | null;
  estado: string;
  prioridad: string;
  usuario: {
    nombre: string;
    apellidos: string;
  };
  producto: {
    nombre_producto: string;
    precio: string;
  };
}

export const useOrdenes = () => {
  const [ordenes, setOrdenes] = useState<OrdenDespacho[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { usuario } = useAuth();
  const token = localStorage.getItem('token'); 

  const fetchOrdenes = useCallback(async () => {
    if (!token) {
      setError('No hay token de autenticación');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orden`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Transformar los datos del backend al formato del frontend
      const ordenesTransformadas = (result.data || []).map((orden: OrdenBackend) => ({
        id: orden.id_orden.toString(), // Convertir a string
        fecha: new Date(orden.fecha_envio).toLocaleDateString('es-ES'),
        trabajadorFabrica: `${orden.usuario.nombre} ${orden.usuario.apellidos}`,
        estado: orden.estado,
        prioridad: orden.prioridad,
        totalProductos: orden.cantidad,
        valorTotal: parseFloat(orden.total) || 0,
        vendedora: orden.producto.nombre_producto
      }));

      setOrdenes(ordenesTransformadas);
      setError(null);
    } catch (err) {
      console.error('Error obteniendo órdenes:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setOrdenes([]); 
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (usuario && token) {
      fetchOrdenes();
    }
  }, [usuario, token, fetchOrdenes]);

  return { ordenes, loading, error, refetch: fetchOrdenes };
};
