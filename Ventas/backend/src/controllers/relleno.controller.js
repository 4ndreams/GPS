"use strict";
import { getRellenosService, 
         getRellenoByIdService, 
         createRellenoService, 
         updateRellenoService, 
         deleteRellenoService } from "../services/relleno.service.js";
import { RellenoQueryValidation, RellenoBodyValidation } from "../validations/relleno.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getRellenoController(req, res) {
    try {
            const { id_relleno } = req.params;
            const { error } = RellenoQueryValidation.validate({ id_relleno });
            if (error) {
                return handleErrorClient(res, 400, error.details[0].message);
            }
    
            const relleno = await getRellenoByIdService(Number(id_relleno));
            if (!relleno) {
                return handleErrorClient(res, 404, "relleno not found");
            }
    
            return handleSuccess(res, 200, "Relleno retrieved successfully", relleno);
        } catch (error) {
            console.error(error);
            return handleErrorServer(res, 500, "Internal server error");
        }
    }

export async function getRellenosController(req, res) {
    try {
        const rellenos = await getRellenosService();
        return handleSuccess(res, 200, "rellenos retrieved successfully", rellenos);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function createRellenoController(req, res) {
    try {
        const { error } = RellenoBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const newRelleno = await createRellenoService(req.body);
        return handleSuccess(res, 201, "Relleno created successfully", newRelleno);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function updateRellenoController(req, res) {
    try {
        const { id_relleno } = req.params;
        const { error } = RellenoBodyValidation.validate(req.body);

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const updatedRelleno = await updateRellenoService(Number(id_relleno), req.body);
        if (!updatedRelleno) {
            return handleErrorClient(res, 404, "Relleno not found");
        }

        return handleSuccess(res, 200, "Relleno updated successfully", updatedRelleno);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function deleteRellenoController(req, res) {
    try {
        const { id_relleno } = req.params;
        const { error } = RellenoQueryValidation.validate({ id_relleno });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const deletedRelleno = await deleteRellenoService(Number(id_relleno));
        if (!deletedRelleno) {
            return handleErrorClient(res, 404, "Relleno not found");
        }

        return handleSuccess(res, 200, "Relleno deleted successfully", deletedRelleno);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}