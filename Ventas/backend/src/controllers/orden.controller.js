"use strict";
import {
    getOrdenesService,
    getOrdenByIdService,
    createOrdenService,
    updateOrdenService,
    deleteOrdenService,
    getOrdenesByFiltersService
} from "../services/orden.service.js";
import { 
    createNotificacionService,
    crearNotificacionRecepcionExitosa
} from "../services/notificacion.service.js";
import { emitNotificacion, emitOrdenActualizada } from "../services/socket.service.js";
import { 
    getTiendaByNombreService,
    getStockTiendaProductoService,
    createTiendaService
} from "../services/tienda.service.js";
import { OrdenQueryValidation, OrdenBodyValidation } from "../validations/orden.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

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

        // Crear notificación para nueva orden
        try {
            const mensaje = `Nueva orden: ${req.body.cantidad} unidades de producto solicitadas desde ${req.body.origen} hacia ${req.body.destino}`;
            
            const notificacion = await createNotificacionService({
                tipo: 'nueva_orden',
                mensaje,
                ordenId: newOrden.id_orden,
                tiendaId: null,
                observaciones: `Prioridad: ${req.body.prioridad || 'Media'}`,
                prioridad: 'normal'
            });

            console.log(`📋 Notificación creada: Nueva orden ${newOrden.id_orden}`);
            
            // Emitir notificación via Socket.io
            emitNotificacion(notificacion);
            
        } catch (notifError) {
            console.error("Error creando notificación para nueva orden:", notifError);
            // No fallar la creación por error en notificación
        }

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

        // 1. Obtener la orden antes de actualizar
        const [ordenAntes, errAntes] = await getOrdenByIdService(Number(id_orden));
        if (errAntes || !ordenAntes) {
            return handleErrorClient(res, 404, errAntes || "Orden no encontrada");
        }

        // 2. Hacer el update de la orden
        const [updatedOrden, err] = await updateOrdenService(Number(id_orden), req.body);
        if (err) {
            return handleErrorClient(res, 404, err);
        }

        // 3. SISTEMA DE NOTIFICACIONES - Crear notificaciones según el cambio de estado
        const estadoAnterior = ordenAntes.estado;
        const estadoNuevo = req.body.estado;

        if (estadoNuevo && estadoAnterior !== estadoNuevo) {
            try {
                // Notificación cuando la orden pasa a "En tránsito"
                if (estadoNuevo === "En tránsito" && estadoAnterior !== "En tránsito") {
                    const mensaje = `Orden despachada desde fábrica hacia ${updatedOrden.destino}`;
                    
                    const notificacion = await createNotificacionService({
                        tipo: 'despacho_en_transito',
                        mensaje,
                        ordenId: id_orden,
                        tiendaId: null,
                        observaciones: `Transportista: ${updatedOrden.transportista || 'No especificado'}`,
                        prioridad: 'normal'
                    });

                    console.log(`📦 Notificación creada: Orden ${id_orden} en tránsito`);
                    
                    // Emitir notificación via Socket.io
                    emitNotificacion(notificacion);
                }

                // Notificación cuando la orden es recibida
                if ((estadoNuevo === "Recibido" || estadoNuevo === "Recibido con problemas") && 
                    estadoAnterior !== "Recibido" && estadoAnterior !== "Recibido con problemas") {
                    
                    const tipoRecepcion = estadoNuevo === "Recibido" ? 'recepcion_exitosa' : 'recepcion_con_problemas';
                    const mensaje = estadoNuevo === "Recibido" 
                        ? `Recepción completada exitosamente en ${updatedOrden.destino}`
                        : `Recepción con problemas en ${updatedOrden.destino}`;

                    const notificacion = await createNotificacionService({
                        tipo: tipoRecepcion,
                        mensaje,
                        ordenId: id_orden,
                        tiendaId: null,
                        observaciones: req.body.observaciones || 'Sin observaciones adicionales',
                        prioridad: estadoNuevo === "Recibido" ? 'normal' : 'alta'
                    });

                    console.log(`📥 Notificación creada: Orden ${id_orden} recibida (${estadoNuevo})`);
                    
                    // Emitir notificación via Socket.io
                    emitNotificacion(notificacion);
                }
            } catch (notifError) {
                console.error("Error creando notificación:", notifError);
                // No fallar la actualización por error en notificación
            }
        }

        // 4. Si el estado cambió a RECIBIDA y antes NO era RECIBIDA => actualizar stock en la tienda destino
        if (
            req.body.estado === "RECIBIDA" &&
            ordenAntes.estado !== "RECIBIDA"
        ) {
            try {
                // 1. Buscar la tienda por nombre
                const tienda = await getTiendaByNombreService(ordenAntes.destino);
                if (!tienda) {
                    return handleErrorClient(res, 404, "Tienda destino no encontrada");
                }
                const id_tienda = tienda.id_tienda;
                const id_producto = ordenAntes.id_producto;
                const cantidad = ordenAntes.cantidad;

                // 2. Buscar el stock de ese producto en la tienda
                let tiendaProducto = await getStockTiendaProductoService(id_tienda, id_producto);

                // 3. Sumar stock si existe, o crear el registro si no
                if (tiendaProducto) {
                    tiendaProducto.stock += cantidad;
                    await tiendaProducto.save();
                } else {
                    await createTiendaService({ id_tienda, id_producto, stock: cantidad });
                }
            } catch (stockError) {
                console.error("Error actualizando stock en tienda:", stockError);
                return handleErrorServer(res, 500, "Error actualizando stock en tienda");
            }
        }

        // Emitir orden actualizada via Socket.io
        emitOrdenActualizada(updatedOrden);
        
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
        return handleSuccess(res, 200, "Orden deleted successfully", deletedOrden);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
