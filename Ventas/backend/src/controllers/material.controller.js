"use strict";
import {
    createMaterialService,
    deleteMaterialService,
    getMaterialByIdService,
    getMaterialesService,
    updateMaterialService
} from "../services/material.service.js";
import { MaterialQueryValidation, MaterialBodyValidation } from "../validations/material.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getMaterialController(req, res) {
    try {
        const { id_material } = req.params;
        const { error } = MaterialQueryValidation.validate({ id_material });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const material = await getMaterialByIdService(Number(id_material));
        if (!material) {
            return handleErrorClient(res, 404, "Material not found");
        }

        return handleSuccess(res, 200, "Material retrieved successfully", material);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function getMaterialsController(req, res) {
    try {
        const materials = await getMaterialesService();
        return handleSuccess(res, 200, "Materials retrieved successfully", materials);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function createMaterialController(req, res) {
    try {
        const { error } = MaterialBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const newMaterial = await createMaterialService(req.body);
        return handleSuccess(res, 201, "Material created successfully", newMaterial);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function updateMaterialController(req, res) {
    try {
        const { id_material } = req.params;
        const { error } = MaterialBodyValidation.validate(req.body);

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const updatedMaterial = await updateMaterialService(Number(id_material), req.body);
        if (!updatedMaterial) {
            return handleErrorClient(res, 404, "Material not found");
        }

        return handleSuccess(res, 200, "Material updated successfully", updatedMaterial);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function deleteMaterialController(req, res) {
    try {
        const { id_material } = req.params;
        const { error } = MaterialQueryValidation.validate({ id_material });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const deletedMaterial = await deleteMaterialService(Number(id_material));
        if (!deletedMaterial) {
            return handleErrorClient(res, 404, "Material not found");
        }

        return handleSuccess(res, 200, "Material deleted successfully", deletedMaterial);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
