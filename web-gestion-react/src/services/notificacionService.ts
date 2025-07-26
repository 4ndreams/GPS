import api from './api';

export interface Notificacion {
  id: number;
  tipo: string;
  mensaje: string;
  tiempo: string;
  leida: boolean;
  orden?: string;
}

export interface NotificacionResponse {
  success: boolean;
  data: Notificacion[];
  message?: string;
}

export const getNotificaciones = async (): Promise<NotificacionResponse> => {
  try {
    const response = await api.get('/notificaciones');
    return {
      success: true,
      data: response.data.data || response.data || []
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('Error obteniendo notificaciones:', error);
    return {
      success: false,
      data: [],
      message: err.response?.data?.message || 'Error al obtener notificaciones'
    };
  }
};

export const getNotificacionesNoLeidas = async (): Promise<NotificacionResponse> => {
  try {
    const response = await api.get('/notificaciones?leida=false');
    return {
      success: true,
      data: response.data.data || response.data || []
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('Error obteniendo notificaciones no leídas:', error);
    return {
      success: false,
      data: [],
      message: err.response?.data?.message || 'Error al obtener notificaciones no leídas'
    };
  }
};

export const marcarNotificacionLeida = async (id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    await api.put(`/notificaciones/${id}/leida`);
    return { success: true };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('Error marcando notificación como leída:', error);
    return {
      success: false,
      message: err.response?.data?.message || 'Error al marcar notificación como leída'
    };
  }
};

export const getAlertasActivas = async (): Promise<NotificacionResponse> => {
  try {
    const response = await api.get('/notificaciones/alertas');
    return {
      success: true,
      data: response.data.data || response.data || []
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('Error obteniendo alertas activas:', error);
    return {
      success: false,
      data: [],
      message: err.response?.data?.message || 'Error al obtener alertas activas'
    };
  }
};

export const resolverAlerta = async (id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    await api.put(`/notificaciones/${id}/resolver`);
    return { success: true };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('Error resolviendo alerta:', error);
    return {
      success: false,
      message: err.response?.data?.message || 'Error al resolver alerta'
    };
  }
}; 