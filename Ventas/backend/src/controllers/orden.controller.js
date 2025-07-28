"use strict";
import {
    getOrdenesService,
    getOrdenByIdService,
    createOrdenService,
    updateOrdenService,
    deleteOrdenService,
    getOrdenesByFiltersService,
    recalcularTotalesService,
    marcarOrdenCompletadaService,
    cancelarOrdenService
} from "../services/orden.service.js";
import { OrdenQueryValidation, OrdenBodyValidation } from "../validations/orden.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { emitOrdenActualizada, emitNotificacion } from "../services/socket.service.js";
import { createNotificacionService } from "../services/notificacion.service.js";

export async function getOrdenController(req, res) {
    try {
        const { id_orden } = req.params;
        const { error } = OrdenQueryValidation.validate({ id_orden });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [orden, err] = await getOrdenByIdService(Number(id_orden));
        if (err) {
            return handleErrorClient(res, 404, err);
        }

        return handleSuccess(res, 200, "Orden retrieved successfully", orden);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function getOrdenesController(req, res) {
    try {
        const { estado, tipo } = req.query;
        
        let ordenes, err;
        if (estado || tipo) {
            // Filtrar por parámetros específicos
            [ordenes, err] = await getOrdenesByFiltersService({ estado, tipo });
        } else {
            [ordenes, err] = await getOrdenesService();
        }
        
        if (err) {
            return handleErrorServer(res, 500, err);
        }
        return handleSuccess(res, 200, "Ordenes retrieved successfully", ordenes);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function createOrdenController(req, res) {
    try {
        const { error } = OrdenBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [newOrden, err] = await createOrdenService(req.body);
        if (err) {
            return handleErrorServer(res, 500, err);
        }

        console.log('🔄 Nueva orden creada:', newOrden.id_orden);
        console.log('🔌 global.io disponible:', !!global.io);

        // Emitir evento de WebSocket para notificar nueva orden
        emitOrdenActualizada(newOrden);
        
        // Crear notificación en la base de datos
        await createNotificacionService({
            tipo: 'nueva_orden',
            mensaje: `Nueva orden creada: ${newOrden.id_orden} - Estado: ${newOrden.estado}`,
            ordenId: newOrden.id_orden,
            prioridad: 'normal'
        });
        
        // Emitir notificación via WebSocket
        emitNotificacion({
            tipo: 'nueva_orden',
            mensaje: `Nueva orden creada: ${newOrden.id_orden} - Estado: ${newOrden.estado}`,
            ordenId: newOrden.id_orden,
            prioridad: 'normal'
        });

        return handleSuccess(res, 201, "Orden created successfully", newOrden);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function updateOrdenController(req, res) {
    try {
        const { id_orden } = req.params;
        const { error } = OrdenBodyValidation.validate(req.body);

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [updatedOrden, err] = await updateOrdenService(Number(id_orden), req.body);
        if (err) {
            return handleErrorClient(res, 404, err);
        }

        // Emitir evento de WebSocket para notificar orden actualizada
        emitOrdenActualizada(updatedOrden);
        
        // Crear notificación en la base de datos
        await createNotificacionService({
            tipo: 'orden_actualizada',
            mensaje: `Orden actualizada: ${updatedOrden.id_orden} - Estado: ${updatedOrden.estado}`,
            ordenId: updatedOrden.id_orden,
            prioridad: 'normal'
        });
        
        // Emitir notificación via WebSocket
        emitNotificacion({
            tipo: 'orden_actualizada',
            mensaje: `Orden actualizada: ${updatedOrden.id_orden} - Estado: ${updatedOrden.estado}`,
            ordenId: updatedOrden.id_orden,
            prioridad: 'normal'
        });

        return handleSuccess(res, 200, "Orden updated successfully", updatedOrden);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function deleteOrdenController(req, res) {
    try {
        const { id_orden } = req.params;
        const { error } = OrdenQueryValidation.validate({ id_orden });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [deletedOrden, err] = await deleteOrdenService(Number(id_orden));
        if (err) {
            return handleErrorClient(res, 404, err);
        }

        // Crear notificación en la base de datos
        await createNotificacionService({
            tipo: 'orden_eliminada',
            mensaje: `Orden eliminada: ${id_orden}`,
            ordenId: id_orden,
            prioridad: 'alta'
        });
        
        // Emitir notificación via WebSocket
        emitNotificacion({
            tipo: 'orden_eliminada',
            mensaje: `Orden eliminada: ${id_orden}`,
            ordenId: id_orden,
            prioridad: 'alta'
        });

        return handleSuccess(res, 200, "Orden deleted successfully", deletedOrden);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function recalcularTotalesController(req, res) {
    try {
        const [actualizadas, err] = await recalcularTotalesService();
        if (err) {
            return handleErrorServer(res, 500, err);
        }
        
        return handleSuccess(res, 200, `Se recalcularon ${actualizadas} órdenes exitosamente`, { actualizadas });
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

// Marcar orden como completada
export async function marcarOrdenCompletadaController(req, res) {
    try {
        const { id_orden } = req.params;
        const { error } = OrdenQueryValidation.validate({ id_orden });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [updatedOrden, err] = await marcarOrdenCompletadaService(Number(id_orden));
        if (err) {
            return handleErrorClient(res, 404, err);
        }

        // Emitir evento de WebSocket para notificar orden actualizada
        emitOrdenActualizada(updatedOrden);
        
        // Crear notificación en la base de datos
        await createNotificacionService({
            tipo: 'orden_completada',
            mensaje: `Orden completada: ${updatedOrden.id_orden} - Estado: ${updatedOrden.estado}`,
            ordenId: updatedOrden.id_orden,
            prioridad: 'normal'
        });
        
        // Emitir notificación via WebSocket
        emitNotificacion({
            tipo: 'orden_completada',
            mensaje: `Orden completada: ${updatedOrden.id_orden} - Estado: ${updatedOrden.estado}`,
            ordenId: updatedOrden.id_orden,
            prioridad: 'normal'
        });

        return handleSuccess(res, 200, "Orden marcada como completada", updatedOrden);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

// Cancelar orden
export async function cancelarOrdenController(req, res) {
    try {
        const { id_orden } = req.params;
        const { error } = OrdenQueryValidation.validate({ id_orden });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [updatedOrden, err] = await cancelarOrdenService(Number(id_orden));
        if (err) {
            return handleErrorClient(res, 404, err);
        }

        // Emitir evento de WebSocket para notificar orden actualizada
        emitOrdenActualizada(updatedOrden);
        
        // Crear notificación en la base de datos
        await createNotificacionService({
            tipo: 'orden_cancelada',
            mensaje: `Orden cancelada: ${updatedOrden.id_orden} - Estado: ${updatedOrden.estado}`,
            ordenId: updatedOrden.id_orden,
            prioridad: 'alta'
        });
        
        // Emitir notificación via WebSocket
        emitNotificacion({
            tipo: 'orden_cancelada',
            mensaje: `Orden cancelada: ${updatedOrden.id_orden} - Estado: ${updatedOrden.estado}`,
            ordenId: updatedOrden.id_orden,
            prioridad: 'alta'
        });

        return handleSuccess(res, 200, "Orden cancelada exitosamente", updatedOrden);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}