import { useState, useEffect, useCallback } from 'react';
import { getOrdenes, type Orden } from '../services/ordenService';

interface UseOrdenesReturn {
  ordenes: Orden[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useOrdenes = (): UseOrdenesReturn => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdenes = useCallback(async () => {
    try {
      setError(null);
      const response = await getOrdenes();
      
      if (response.success) {
        setOrdenes(response.data);
      } else {
        console.error('Error obteniendo órdenes:', response.message);
        setOrdenes([]);
      }
    } catch (err) {
      console.error('Error cargando órdenes:', err);
      setError('Error al cargar las órdenes');
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchOrdenes();
  }, [fetchOrdenes]);

  useEffect(() => {
    fetchOrdenes();
  }, [fetchOrdenes]);

  return {
    ordenes,
    loading,
    error,
    refresh,
  };
}; 