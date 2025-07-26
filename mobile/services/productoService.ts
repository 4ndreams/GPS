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

// Obtener todos los productos
export const getProductos = async (): Promise<Producto[]> => {
  try {
    const response = await api.get('/products/all');
    // La respuesta tiene estructura anidada: data[0] contiene el array de productos
    return response.data.data?.[0] || response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching productos:', error);
    return [];
  }
};

// Obtener un producto por ID
export const getProductoById = async (id: number): Promise<Producto | null> => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching producto by id:', error);
    return null;
  }
};

// Obtener productos por categoría (si existe)
export const getProductosByCategoria = async (categoria: string): Promise<Producto[]> => {
  try {
    const response = await api.get(`/products/all?categoria=${categoria}`);
    // La respuesta tiene estructura anidada: data[0] contiene el array de productos
    return response.data.data?.[0] || response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching productos by categoria:', error);
    return [];
  }
};

// Función para formatear precio
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(price);
};

// Función para obtener productos enchapados
export const getProductosEnchapados = async (): Promise<Producto[]> => {
  const productos = await getProductos();
  return productos.filter(producto => 
    producto.nombre_producto.toLowerCase().includes('enchape') ||
    producto.descripcion?.toLowerCase().includes('enchapada')
  );
};

// Función para obtener productos terciados
export const getProductosTerciados = async (): Promise<Producto[]> => {
  const productos = await getProductos();
  return productos.filter(producto => 
    producto.nombre_producto.toLowerCase().includes('terciado') ||
    producto.descripcion?.toLowerCase().includes('terciado')
  );
};

// Función para buscar productos por nombre
export const searchProductos = async (searchTerm: string): Promise<Producto[]> => {
  const productos = await getProductos();
  return productos.filter(producto =>
    producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}; 