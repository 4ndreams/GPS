import api from './api';

export interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  stock: number;
  descripcion?: string;
  medida_ancho?: number;
  medida_largo?: number;
  medida_alto?: number;
  id_material?: number;
  id_relleno?: number;
  id_tipo?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductoResponse {
  success: boolean;
  data: Producto[];
  message?: string;
}

export interface ProductoByIdResponse {
  success: boolean;
  data: Producto;
  message?: string;
}

// Obtener todos los productos
export const getProductos = async (): Promise<ProductoResponse> => {
  try {
    const response = await api.get('/products/all');
    console.log('Response from backend:', response.data);
    
    // Verificar la estructura de la respuesta
    // La respuesta tiene estructura anidada: data[0] contiene el array de productos
    const productos = response.data.data?.[0] || response.data.data || response.data || [];
    console.log('Productos extraídos:', productos);
    
    return { 
      success: true, 
      data: productos 
    };
  } catch (error: unknown) {
    console.error('Error fetching productos:', error);
    return { 
      success: false, 
      data: [], 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};

// Obtener un producto por ID
export const getProductoById = async (id: number): Promise<ProductoByIdResponse> => {
  try {
    const response = await api.get(`/products/${id}`);
    return { 
      success: true, 
      data: response.data.data || response.data 
    };
  } catch (error: unknown) {
    console.error('Error fetching producto by id:', error);
    return { 
      success: false, 
      data: {} as Producto, 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};

// Crear un nuevo producto
export const createProducto = async (productoData: Partial<Producto>): Promise<ProductoByIdResponse> => {
  try {
    const response = await api.post('/products', productoData);
    return { 
      success: true, 
      data: response.data.data || response.data 
    };
  } catch (error: unknown) {
    console.error('Error creating producto:', error);
    return { 
      success: false, 
      data: {} as Producto, 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};

// Actualizar un producto
export const updateProducto = async (id: number, productoData: Partial<Producto>): Promise<ProductoByIdResponse> => {
  try {
    const response = await api.put(`/products/${id}`, productoData);
    return { 
      success: true, 
      data: response.data.data || response.data 
    };
  } catch (error: unknown) {
    console.error('Error updating producto:', error);
    return { 
      success: false, 
      data: {} as Producto, 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};

// Eliminar un producto
export const deleteProducto = async (id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    await api.delete(`/products/${id}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('Error deleting producto:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};

// Obtener productos por categoría (si existe)
export const getProductosByCategoria = async (categoria: string): Promise<ProductoResponse> => {
  try {
    const response = await api.get(`/products/all?categoria=${categoria}`);
    // La respuesta tiene estructura anidada: data[0] contiene el array de productos
    return { 
      success: true, 
      data: response.data.data?.[0] || response.data.data || response.data || [] 
    };
  } catch (error: unknown) {
    console.error('Error fetching productos by categoria:', error);
    return { 
      success: false, 
      data: [], 
      message: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}; 