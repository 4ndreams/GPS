import api from './api';

export interface ComprasResponse {
  nombre_producto: string;
  costo_compra: number;
  stock: number;
  tipo: string;
}

interface BodegaActualizada {
  id: number;
  nombre: string;
  tipo: 'material' | 'relleno';
  stock: number;
}

interface CompraRegistrada {
  id: number;
  fecha: string;
  id_bodega: number;
  cantidad: number;
  costo_unitario: number;
}

export interface CompraResult {
  mensaje: string;
  tipo: 'actualizacion' | 'nueva';
  bodega_actualizada: BodegaActualizada[];
  compra_registrada: CompraRegistrada;
}

export const comprasBodegaService = {
  create: async (data: ComprasResponse): Promise<CompraResult> => {
    const response = await api.post('/compXbog/', data);
    return response.data.data;
  },
};

