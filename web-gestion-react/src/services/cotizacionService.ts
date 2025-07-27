import api from './api';

export interface CotizacionResponse {
  id_producto_personalizado: number;
  nombre_apellido_contacto: string;
  email_contacto: string;
  telefono_contacto: string;
  rut_contacto: string;
  mensaje: string;
  medida_ancho: number;
  medida_alto: number;
  medida_largo: number;
  tipo_puerta: string;
  estado: string;
  precio?: number;
  createdAt: string;
  updatedAt: string;
  material: {
    id_material: number;
    nombre_material: string;
  };
  relleno: {
    id_relleno: number;
    nombre_relleno: string;
  };
  usuario?: {
    id_usuario: number;
    email: string;
  };
}

export interface UpdatePrecioData {
  precio: number;
}

export interface UpdateEstadoData {
  estado: string;
}

export interface UpdateEstadoResponse {
  productoPersonalizado: CotizacionResponse;
  ventaResult?: {
    success: boolean;
    error: string | null;
    venta: {
      id_venta: number;
      // ...otros campos relevantes de la venta si los necesitas
    } | null;
  };
}

export const cotizacionService = {
  // Obtener todas las cotizaciones
  getAllCotizaciones: async (): Promise<CotizacionResponse[]> => {
    const response = await api.get('/productos-personalizados');
    return response.data.data;
  },

  // Obtener una cotización por ID
  getCotizacionById: async (id: number): Promise<CotizacionResponse> => {
    const response = await api.get(`/productos-personalizados/${id}`);
    return response.data.data;
  },

  // Actualizar estado de una cotización
  updateEstado: async (id: number, data: UpdateEstadoData): Promise<UpdateEstadoResponse> => {
    try {
      const response = await api.patch(`/productos-personalizados/${id}/estado`, data);
      return response.data.data;
    } catch (error: any) {
      // Si el backend responde con error de precio nulo o vacío, lanzar el mensaje
      const errorMsg = error?.response?.data?.message || error.message || 'Error al actualizar estado';
      throw new Error(errorMsg);
    }
  },

  // Actualiar cotización (solo admin y fabrica)
  updateCotizacion: async (id: number, data: Partial<CotizacionResponse>): Promise<CotizacionResponse> => {
    const response = await api.patch(`/productos-personalizados/${id}`, data);
    return response.data.data;
  },
  // Actualizar precio de una cotización
  updatePrecio: async (id: number, data: UpdatePrecioData): Promise<CotizacionResponse> => {
    const response = await api.patch(`/productos-personalizados/${id}/precio`, data);
    return response.data.data;
  },

  // Eliminar una cotización (solo admin)
  deleteCotizacion: async (id: number): Promise<void> => {
    await api.delete(`/productos-personalizados/${id}`);
  }
};

// Constantes para estados
export const ESTADOS_COTIZACION = [
  'Solicitud Recibida',
  'En Proceso', 
  'Lista para retirar',
  'Cancelada',
  'Producto Entregado'
] as const;

export type EstadoCotizacion = typeof ESTADOS_COTIZACION[number];
