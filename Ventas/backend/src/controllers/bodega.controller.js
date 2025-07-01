"use strict";
import {
    createBodegaService,
    getBodegaService, 
    getBodegasService,
    updateBodegaService,
    deleteBodegaService
} from "../services/bodega.service.js";
import { bodegaQueryValidation, bodegaBodyValidation } from "../validations/bodega.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getBodegaController(req, res) {
    try {
        const { id_bodega } = req.params;
        const { error } = bodegaQueryValidation.validate({ id_bodega });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }
        
        const bodega = await getBodegaService(Number(id_bodega));
        if (!bodega) {
            return handleErrorClient(res, 404, "Bodega not found");
        }

        return handleSuccess(res, 200, "Bodega retrieved successfully", bodega);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
    
}
export async function getBodegasController(req, res) {
    try {
        const bodegas = await getBodegasService();
        return handleSuccess(res, 200, "Bodegas retrieved successfully", bodegas);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function createBodegaController(req, res) {
    try {
        console.log("Creating Bodega with body:", req.body);
        const { error } = bodegaBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const newBodega = await createBodegaService(req.body);
        return handleSuccess(res, 201, "Bodega created successfully", newBodega);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function updateBodegaController(req, res) {
    try {
        const { id_bodega } = req.params;
        const { error } = bodegaBodyValidation.validate(req.body);

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const updatedBodega = await updateBodegaService(Number(id_bodega), req.body);
        if (!updatedBodega) {
            return handleErrorClient(res, 404, "Bodega not found");
        }

        return handleSuccess(res, 200, "Bodega updated successfully", updatedBodega);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function deleteBodegaController(req, res) {
    try {
        const { id_bodega } = req.params;
        const deletedBodega = await deleteBodegaService(id_bodega);
        if (!deletedBodega) {
            return handleErrorClient(res, 404, "Bodega not found");
        }

        return handleSuccess(res, 200, "Bodega deleted successfully", deletedBodega);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}