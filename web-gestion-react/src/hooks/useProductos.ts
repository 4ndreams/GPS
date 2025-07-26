import { useState, useEffect, useCallback } from 'react';
import { getProductos, getProductoById, createProducto, updateProducto, deleteProducto, type Producto } from '../services/productoService';

interface UseProductosReturn {
  productos: Producto[];
  loading: boolean;
  error: string | null;
  fetchProductos: () => Promise<void>;
  getProducto: (id: number) => Promise<Producto | null>;
  createProducto: (productoData: Partial<Producto>) => Promise<boolean>;
  updateProducto: (id: number, productoData: Partial<Producto>) => Promise<boolean>;
  deleteProducto: (id: number) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export const useProductos = (): UseProductosReturn => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getProductos();
      if (response.success) {
        // Verificar que los productos sean válidos
        const productosValidos = response.data.filter(producto => 
          producto && producto.nombre_producto && producto.id_producto
        );
        console.log('Productos válidos:', productosValidos);
        setProductos(productosValidos);
      } else {
        setError(response.message || 'Error al cargar productos');
        setProductos([]);
      }
    } catch {
      setError('Error de conexión al cargar productos');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProducto = useCallback(async (id: number): Promise<Producto | null> => {
    try {
      const response = await getProductoById(id);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Error al obtener producto');
        return null;
      }
    } catch {
      setError('Error de conexión al obtener producto');
      return null;
    }
  }, []);

  const createProductoHandler = useCallback(async (productoData: Partial<Producto>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createProducto(productoData);
      if (response.success) {
        // Recargar la lista de productos
        await fetchProductos();
        return true;
      } else {
        setError(response.message || 'Error al crear producto');
        return false;
      }
    } catch {
      setError('Error de conexión al crear producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchProductos]);

  const updateProductoHandler = useCallback(async (id: number, productoData: Partial<Producto>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateProducto(id, productoData);
      if (response.success) {
        // Actualizar el producto en la lista local
        setProductos(prev => 
          prev.map(producto => 
            producto.id_producto === id ? response.data : producto
          )
        );
        return true;
      } else {
        setError(response.message || 'Error al actualizar producto');
        return false;
      }
    } catch {
      setError('Error de conexión al actualizar producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProductoHandler = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await deleteProducto(id);
      if (response.success) {
        // Remover el producto de la lista local
        setProductos(prev => prev.filter(producto => producto.id_producto !== id));
        return true;
      } else {
        setError(response.message || 'Error al eliminar producto');
        return false;
      }
    } catch {
      setError('Error de conexión al eliminar producto');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchProductos();
  }, [fetchProductos]);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  return {
    productos,
    loading,
    error,
    fetchProductos,
    getProducto,
    createProducto: createProductoHandler,
    updateProducto: updateProductoHandler,
    deleteProducto: deleteProductoHandler,
    refresh
  };
}; 