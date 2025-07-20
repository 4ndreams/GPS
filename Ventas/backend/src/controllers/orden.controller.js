"use strict";
import {
    getOrdenesService,
    getOrdenByIdService,
    createOrdenService,
    updateOrdenService,
    deleteOrdenService,
    getOrdenesByFiltersService
} from "../services/orden.service.js";
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