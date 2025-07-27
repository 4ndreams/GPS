"use strict";
import {
    createTiendaService,
    deleteTiendaService,
    getTiendaByIdService,
    getTiendasService,
    updateTiendaService
} from "../services/tienda.service.js";
import { TiendaQueryValidation, TiendaBodyValidation } from "../validations/tienda.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getTiendaController(req, res) {
    try {
        const { id_tienda } = req.params;
        const { error } = TiendaQueryValidation.validate({ id_tienda });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const tienda = await getTiendaByIdService(Number(id_tienda));
        if (!tienda) {
            return handleErrorClient(res, 404, "Tienda not found");
        }

        return handleSuccess(res, 200, "Tienda retrieved successfully", tienda);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function getTiendasController(req, res) {
    try {
        const tiendas = await getTiendasService();
        return handleSuccess(res, 200, "Tiendas retrieved successfully", tiendas);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}


export async function createTiendaController(req, res) {
    try {
        const { error } = TiendaBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const newTienda = await createTiendaService(req.body);
        return handleSuccess(res, 201, "Tienda created successfully", newTienda);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function updateTiendaController(req, res) {
    try {
        const { id_tienda } = req.params;
        const { error } = TiendaBodyValidation.validate(req.body);

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const updatedTienda = await updateTiendaService(Number(id_tienda), req.body);
        if (!updatedTienda) {
            return handleErrorClient(res, 404, "Tienda not found");
        }

        return handleSuccess(res, 200, "Tienda updated successfully", updatedTienda);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function deleteTiendaController(req, res) {
    try {
        const { id_tienda } = req.params;
        const deletedTienda = await deleteTiendaService(id_tienda);
        if (!deletedTienda) {
            return handleErrorClient(res, 404, "Tienda not found");
        }

        return handleSuccess(res, 200, "Tienda deleted successfully", deletedTienda);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}