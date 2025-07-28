"use strict";
import { sendDespachoAlertEmail, sendDespachoRecepcionExitosaEmail } from "../helpers/email.helper.js";

// Sistema de notificaciones en memoria (en producción usarías una base de datos)
let notificaciones = [];
let alertasActivas = [];

// Función temporal para crear notificaciones de prueba
export function crearNotificacionPrueba() {
  const notificacion = {
    id: Date.now() + Math.random(),
    tipo: 'test',
    mensaje: 'Notificación de prueba para marcar como leída',
    ordenId: null,
    tiendaId: null,
    productos_faltantes: [],
    productos_defectuosos: [],
    observaciones: null,
    prioridad: 'normal',
    fecha_creacion: new Date().toISOString(),
    tiempo: new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    leida: false,
    resuelta: false
  };

  notificaciones.unshift(notificacion);
  console.log('🧪 Notificación de prueba creada:', notificacion.id);
  return notificacion;
}

// Crear una notificación/alerta
export async function createNotificacionService(notificacionData) {
  try {
    const {
      tipo,
      mensaje,
      ordenId,
      tiendaId,
      productos_faltantes = [],
      productos_defectuosos = [],
      observaciones,
      prioridad = 'normal'
    } = notificacionData;

    const notificacion = {
      id: Date.now() + Math.random(),
      tipo,
      mensaje,
      ordenId,
      tiendaId,
      productos_faltantes,
      productos_defectuosos,
      observaciones,
      prioridad,
      fecha_creacion: new Date().toISOString(),
      tiempo: new Date().toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      leida: false,
      resuelta: false
    };

    // Agregar a notificaciones
    notificaciones.unshift(notificacion);

    // Si es una alerta crítica, agregarla a alertas activas
    if (tipo === 'alerta_faltante' || tipo === 'defecto_calidad' || tipo === 'recepcion_con_problemas') {
      alertasActivas.unshift(notificacion);
    }

    // Enviar email al administrador si es crítico
    if (prioridad === 'crítica' || tipo === 'alerta_faltante' || tipo === 'recepcion_con_problemas') {
      await enviarEmailAlerta(notificacion);
    }

    console.log('📢 Nueva notificación creada:', {
      id: notificacion.id,
      tipo,
      mensaje,
      ordenId
    });

    return [notificacion, null];
  } catch (error) {
    console.error("Error al crear notificación:", error);
    return [null, error.message];
  }
}

// Obtener todas las notificaciones
export async function getNotificacionesService(limit = 50, soloNoLeidas = false) {
  try {
    let notificacionesFiltradas = notificaciones;
    
    if (soloNoLeidas) {
      notificacionesFiltradas = notificaciones.filter(n => !n.leida);
    }
    
    return [notificacionesFiltradas.slice(0, limit), null];
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return [[], error.message];
  }
}

// Obtener alertas activas
export async function getAlertasActivasService() {
  try {
    const alertas = alertasActivas.filter(alerta => !alerta.resuelta);
    return [alertas, null];
  } catch (error) {
    console.error("Error al obtener alertas activas:", error);
    return [[], error.message];
  }
}

// Marcar notificación como leída
export async function marcarNotificacionLeidaService(notificacionId) {
  try {
    const notificacion = notificaciones.find(n => {
      // Comparar como strings para manejar IDs decimales
      return String(n.id) === String(notificacionId);
    });
    
    if (!notificacion) {
      return [null, "Notificación no encontrada"];
    }

    notificacion.leida = true;
    console.log('✅ Notificación marcada como leída:', notificacion.id);
    return [notificacion, null];
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error);
    return [null, error.message];
  }
}

// Marcar todas las notificaciones como leídas
export async function marcarTodasNotificacionesLeidasService() {
  try {
    const notificacionesNoLeidas = notificaciones.filter(n => !n.leida);
    
    if (notificacionesNoLeidas.length === 0) {
      return [0, null]; // No hay notificaciones para marcar
    }

    // Marcar todas las notificaciones no leídas como leídas
    notificacionesNoLeidas.forEach(notificacion => {
      notificacion.leida = true;
    });

    console.log('✅ Todas las notificaciones marcadas como leídas:', notificacionesNoLeidas.length);
    return [notificacionesNoLeidas.length, null];
  } catch (error) {
    console.error("Error al marcar todas las notificaciones como leídas:", error);
    return [null, error.message];
  }
}

// Resolver alerta
export async function resolverAlertaService(alertaId, resolucion) {
  try {
    const alerta = alertasActivas.find(a => a.id === alertaId);
    if (!alerta) {
      return [null, "Alerta no encontrada"];
    }

    alerta.resuelta = true;
    alerta.fecha_resolucion = new Date().toISOString();
    alerta.resolucion = resolucion;

    console.log('✅ Alerta resuelta:', {
      id: alertaId,
      resolucion
    });

    return [alerta, null];
  } catch (error) {
    console.error("Error al resolver alerta:", error);
    return [null, error.message];
  }
}

// Función para enviar email de alerta al administrador
async function enviarEmailAlerta(notificacion) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@terplac.com';
    
    await sendDespachoAlertEmail({
      to: adminEmail,
      notificacion
    });

    console.log('📧 Email de alerta enviado al administrador:', adminEmail);
  } catch (error) {
    console.error('Error al enviar email de alerta:', error);
  }
}

// Función auxiliar para crear alerta de faltantes
export async function crearAlertaFaltantes(ordenId, tiendaId, productosFaltantes, observaciones) {
  const mensaje = `Orden ${ordenId}: Faltan ${productosFaltantes.length} producto(s) en la recepción`;
  
  return await createNotificacionService({
    tipo: 'alerta_faltante',
    mensaje,
    ordenId,
    tiendaId,
    productos_faltantes: productosFaltantes,
    observaciones,
    prioridad: 'crítica'
  });
}

// Función auxiliar para crear alerta de defectos
export async function crearAlertaDefectos(ordenId, tiendaId, productosDefectuosos, observaciones) {
  const mensaje = `Orden ${ordenId}: Detectados ${productosDefectuosos.length} producto(s) con defectos de calidad`;
  
  return await createNotificacionService({
    tipo: 'defecto_calidad',
    mensaje,
    ordenId,
    tiendaId,
    productos_defectuosos: productosDefectuosos,
    observaciones,
    prioridad: 'alta'
  });
}

// Función auxiliar para crear notificación de recepción exitosa
export async function crearNotificacionRecepcionExitosa(ordenId, tiendaId, productosRecibidos, tienda, vendedora, observaciones) {
  const mensaje = `Orden ${ordenId}: Recepción completada exitosamente en ${tienda}`;
  
  const notificacionData = {
    tipo: 'recepcion_exitosa',
    mensaje,
    ordenId,
    tiendaId,
    productos_recibidos: productosRecibidos,
    tienda,
    vendedora,
    observaciones,
    prioridad: 'normal'
  };

  const [notificacion, error] = await createNotificacionService(notificacionData);

  if (!error && notificacion) {
    // Enviar email de confirmación al administrador
    await enviarEmailRecepcionExitosa(notificacion);
  }

  return [notificacion, error];
}

// Función auxiliar para enviar email de recepción exitosa
async function enviarEmailRecepcionExitosa(notificacion) {
  try {
    // Email del administrador (configurar según tu sistema)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@terplac.com';
    
    await sendDespachoRecepcionExitosaEmail({
      to: adminEmail,
      notificacion
    });

    console.log(`📧 Email de recepción exitosa enviado a ${adminEmail} para orden ${notificacion.ordenId}`);
  } catch (error) {
    console.error('Error enviando email de recepción exitosa:', error);
  }
}
