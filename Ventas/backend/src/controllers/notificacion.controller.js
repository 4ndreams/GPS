"use strict";
import {
    createNotificacionService,
    getNotificacionesService,
    getAlertasActivasService,
    marcarNotificacionLeidaService,
    resolverAlertaService,
    crearAlertaFaltantes,
    crearAlertaDefectos,
    crearNotificacionRecepcionExitosa
} from "../services/notificacion.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Crear una nueva notificación/alerta
export async function createNotificacionController(req, res) {
    try {
        const { tipo, mensaje, ordenId, tiendaId, productos_faltantes, productos_defectuosos, observaciones, prioridad } = req.body;

        if (!tipo || !mensaje || !ordenId) {
            return handleErrorClient(res, 400, "Los campos tipo, mensaje y ordenId son obligatorios");
        }

        const [notificacion, err] = await createNotificacionService({
            tipo,
            mensaje,
            ordenId,
            tiendaId,
            productos_faltantes,
            productos_defectuosos,
            observaciones,
            prioridad
        });

        if (err) {
            return handleErrorClient(res, 400, err);
        }

        return handleSuccess(res, 201, "Notificación created successfully", notificacion);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

// Obtener todas las notificaciones
export async function getNotificacionesController(req, res) {
    try {
        const { limit, leida } = req.query;
        const soloNoLeidas = leida === 'false';
        const [notificaciones, err] = await getNotificacionesService(limit ? parseInt(limit) : 50, soloNoLeidas);

        if (err) {
            return handleErrorClient(res, 400, err);
        }

        return handleSuccess(res, 200, "Notificaciones retrieved successfully", notificaciones);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

// Obtener alertas activas
export async function getAlertasActivasController(req, res) {
    try {
        const [alertas, err] = await getAlertasActivasService();

        if (err) {
            return handleErrorClient(res, 400, err);
        }

        return handleSuccess(res, 200, "Alertas activas retrieved successfully", alertas);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

// Marcar notificación como leída
export async function marcarNotificacionLeidaController(req, res) {
    try {
        const { id } = req.params;
        const [notificacion, err] = await marcarNotificacionLeidaService(parseFloat(id));

        if (err) {
            return handleErrorClient(res, 404, err);
        }

        return handleSuccess(res, 200, "Notificación marked as read", notificacion);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

// Resolver alerta
export async function resolverAlertaController(req, res) {
    try {
        const { id } = req.params;
        const { resolucion } = req.body;

        if (!resolucion) {
            return handleErrorClient(res, 400, "La resolución es obligatoria");
        }

        const [alerta, err] = await resolverAlertaService(parseFloat(id), resolucion);

        if (err) {
            return handleErrorClient(res, 404, err);
        }

        return handleSuccess(res, 200, "Alerta resolved successfully", alerta);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

// Crear alerta de productos faltantes (usado desde confirmación de recepción)
export async function crearAlertaFaltantesController(req, res) {
    try {
        const { ordenId, tiendaId, productos_faltantes, observaciones } = req.body;

        if (!ordenId || !productos_faltantes || productos_faltantes.length === 0) {
            return handleErrorClient(res, 400, "Los campos ordenId y productos_faltantes son obligatorios");
        }

        const [alerta, err] = await crearAlertaFaltantes(ordenId, tiendaId, productos_faltantes, observaciones);

        if (err) {
            return handleErrorClient(res, 400, err);
        }

        return handleSuccess(res, 201, "Alerta de faltantes created successfully", alerta);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

// Crear alerta de defectos de calidad
export async function crearAlertaDefectosController(req, res) {
    try {
        const { ordenId, tiendaId, productos_defectuosos, observaciones } = req.body;

        if (!ordenId || !productos_defectuosos || productos_defectuosos.length === 0) {
            return handleErrorClient(res, 400, "Los campos ordenId y productos_defectuosos son obligatorios");
        }

        const [alerta, err] = await crearAlertaDefectos(ordenId, tiendaId, productos_defectuosos, observaciones);

        if (err) {
            return handleErrorClient(res, 400, err);
        }

        return handleSuccess(res, 201, "Alerta de defectos created successfully", alerta);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

// Crear notificación de recepción exitosa
export async function crearRecepcionExitosaController(req, res) {
    try {
        const { ordenId, tiendaId, productos_recibidos, tienda, vendedora, observaciones } = req.body;

        if (!ordenId || !productos_recibidos || productos_recibidos.length === 0) {
            return handleErrorClient(res, 400, "Los campos ordenId y productos_recibidos son obligatorios");
        }

        const [notificacion, err] = await crearNotificacionRecepcionExitosa(
            ordenId,
            tiendaId,
            productos_recibidos,
            tienda,
            vendedora,
            observaciones
        );

        if (err) {
            return handleErrorClient(res, 400, err);
        }

        return handleSuccess(res, 201, "Notificación de recepción exitosa created successfully", notificacion);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
