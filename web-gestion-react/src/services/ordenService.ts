import api from './api';

export interface Orden {
  id_orden: number;
  cantidad: number;
  estado: string;
  fecha_solicitud: string;
  fecha_envio?: string;
  fecha_entrega?: string;
  observaciones?: string;
  prioridad?: string;
  origen?: string;
  destino?: string;
  transportista?: string;
  producto?: {
    id_producto: number;
    nombre_producto: string;
    precio?: number;
  };
  usuario?: {
    id_usuario: number;
    nombre: string;
    email: string;
  };
  bodega?: {
    id_bodega: number;
    nombre_bodega: string;
  };
}

export interface OrdenResponse {
  success: boolean;
  data: Orden[];
  message?: string;
}

// Obtener todas las órdenes
export const getOrdenes = async (): Promise<OrdenResponse> => {
  try {
          const response = await api.get('/orden');
    return {
      success: true,
      data: response.data.data || response.data || []
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('Error obteniendo órdenes:', error);
    return {
      success: false,
      data: [],
      message: err.response?.data?.message || 'Error al obtener órdenes'
    };
  }
};

// Obtener una orden específica
export const getOrdenById = async (id: string): Promise<OrdenResponse> => {
  try {
    const response = await api.get(`/orden/${id}`);
    return {
      success: true,
      data: [response.data.data || response.data]
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('Error obteniendo orden:', error);
    return {
      success: false,
      data: [],
      message: err.response?.data?.message || 'Error al obtener orden'
    };
  }
};

// Crear una nueva orden
export const createOrden = async (orden: Partial<Orden>): Promise<OrdenResponse> => {
  try {
    const response = await api.post('/orden', orden);
    return {
      success: true,
      data: [response.data.data || response.data]
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('Error creando orden:', error);
    return {
      success: false,
      data: [],
      message: err.response?.data?.message || 'Error al crear orden'
    };
  }
};

// Actualizar una orden
export const updateOrden = async (id: string, orden: Partial<Orden>): Promise<OrdenResponse> => {
  try {
    const response = await api.put(`/orden/${id}`, orden);
    return {
      success: true,
      data: [response.data.data || response.data]
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('Error actualizando orden:', error);
    return {
      success: false,
      data: [],
      message: err.response?.data?.message || 'Error al actualizar orden'
    };
  }
};

// Eliminar una orden
export const deleteOrden = async (id: string): Promise<OrdenResponse> => {
  try {
    const response = await api.delete(`/orden/${id}`);
    return {
      success: true,
      data: [response.data.data || response.data]
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('Error eliminando orden:', error);
    return {
      success: false,
      data: [],
      message: err.response?.data?.message || 'Error al eliminar orden'
    };
  }
}; 