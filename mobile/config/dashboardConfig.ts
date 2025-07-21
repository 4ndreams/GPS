import { Ionicons } from '@expo/vector-icons';

export type PerfilType = 'fabrica' | 'tienda';
export type TabKey = string;

export interface CounterConfig {
  key: string;
  label: string;
  apiEndpoint: string;
  countField?: string;
}

export interface TabConfig {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface ActionButtonConfig {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: string;
  style?: 'primary' | 'secondary' | 'warning' | 'success';
}

export interface DashboardConfig {
  title: string;
  counters: CounterConfig[];
  tabs: TabConfig[];
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
  };
  apiConfig: {
    baseEndpoints: {
      [key: string]: string;
    };
  };
}

export const DASHBOARD_CONFIGS: Record<PerfilType, DashboardConfig> = {
  fabrica: {
    title: 'Flujo de despacho',
    counters: [
      {
        key: 'pendientes',
        label: 'Pendientes',
        apiEndpoint: '/orden/test?estado=Pendiente',
        countField: 'length'
      },
      {
        key: 'fabricando',
        label: 'Fabricando',
        apiEndpoint: '/orden/test?estado=En producción',
        countField: 'length'
      },
      {
        key: 'fabricados',
        label: 'Fabricados',
        apiEndpoint: '/orden/test?estado=Fabricada',
        countField: 'length'
      }
    ],
    tabs: [
      {
        key: 'pendientes',
        label: 'Pendientes',
        icon: 'time-outline',
      },
      {
        key: 'fabricando',
        label: 'Fabricando',
        icon: 'construct-outline',
      },
      {
        key: 'fabricados',
        label: 'Fabricados',
        icon: 'checkmark-done-outline',
      },
    ],
    colors: {
      primary: '#DC2626',
      secondary: '#0066CC',
      success: '#059669',
      warning: '#FFA500',
      danger: '#DC2626',
    },
    apiConfig: {
      baseEndpoints: {
        pendientes: '/orden/test?estado=Pendiente',
        fabricando: '/orden/test?estado=En producción',
        fabricados: '/orden/test?estado=Fabricada',
        'crear-despacho': '/despachos/test',
        'cambiar-estado': '/orden/test'
      },
    },
  },
  tienda: {
    title: 'Perfil Ventas',
    counters: [
      {
        key: 'despachos',
        label: 'En Tránsito',
        apiEndpoint: '/orden/test?estado=En tránsito',
      },
      {
        key: 'pedidos-stock',
        label: 'Pedidos Stock',
        apiEndpoint: '/orden/test?tipo=stock&estado=Pendiente,En producción',
      },
      {
        key: 'recibidos',
        label: 'Recibidos',
        apiEndpoint: '/orden/test?estado=Recibido,Recibido con problemas',
      },
    ],
    tabs: [
      {
        key: 'despachos',
        label: 'Despachos',
        icon: 'cube-outline',
      },
      {
        key: 'pedidos-stock',
        label: 'Pedidos Stock',
        icon: 'clipboard-outline',
      },
      {
        key: 'recibidos',
        label: 'Recibidos',
        icon: 'checkmark-circle-outline',
      },
    ],
    colors: {
      primary: '#DC2626',
      secondary: '#0066CC',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#DC2626',
    },
    apiConfig: {
      baseEndpoints: {
        despachos: '/orden/test?estado=En tránsito',
        'pedidos-stock': '/orden/test?tipo=stock&estado=Pendiente,En producción',
        recibidos: '/orden/test?estado=Recibido,Recibido con problemas',
        'confirmar-recepcion': '/orden/test',
        'productos': '/producto'
      },
    },
  },
};

export const getConfigForProfile = (perfil: PerfilType): DashboardConfig => {
  return DASHBOARD_CONFIGS[perfil];
};

export const getPrioridadColor = (prioridad?: string): string => {
  switch (prioridad) {
    case 'Urgente': return '#DC2626';
    case 'Alta': return '#FF6B35';
    case 'Media': return '#FFA500';
    case 'Baja': return '#00AA00';
    default: return '#666666';
  }
};

export const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case 'Pendiente': return '#FFA500';
    case 'En producción': return '#8B5CF6';
    case 'Fabricada': return '#059669';
    case 'En tránsito': return '#0066CC';
    case 'Recibido': return '#10B981';
    case 'Recibido con problemas': return '#DC2626';
    case 'Despachada': return '#6366F1';
    default: return '#666666';
  }
};
