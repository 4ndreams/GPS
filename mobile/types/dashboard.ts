export interface Producto {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  descripcion: string;
}

export interface BaseOrden {
  id_orden: number;
  producto: Producto;
  cantidad: number;
  estado: string;
  fecha_envio?: string;
  fecha_entrega?: string;
  fecha_solicitud?: string;
  observaciones?: string;
  prioridad?: 'Baja' | 'Media' | 'Alta' | 'Urgente';
  origen?: string;
  destino?: string;
  transportista?: string;
  vendedor?: string;
  cliente?: string;
}

export interface OrdenFabrica extends BaseOrden {
  estado: 'Pendiente' | 'En producción' | 'Fabricada' | 'Despachada';
  fecha_solicitud: string;
  vendedor: string;
  cliente?: string;
}

export interface OrdenVentas extends BaseOrden {
  estado: 'En tránsito' | 'Recibido' | 'Recibido con problemas' | 'Pendiente' | 'En producción' | 'Fabricada';
  fecha_envio: string;
  origen: string;
  destino: string;
}

export interface PedidoStock extends BaseOrden {
  estado: 'Pendiente' | 'En producción' | 'Fabricada';
  fecha_solicitud: string;
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Urgente';
}

export interface DashboardData {
  [key: string]: BaseOrden[];
}

export interface FormState {
  [key: string]: string | boolean;
}

export interface ProcessingState {
  [key: number]: boolean;
}
