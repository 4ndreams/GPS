"use strict";
import {
    createTipoService,
    deleteTipoService,
    getTipoByIdService,
    getTiposService,
    updateTipoService
} from "../services/tipo.service.js";
import { TipoQueryValidation, TipoBodyValidation } from "../validations/tipo.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getTipoController(req, res) {
    try {
        const { id_tipo } = req.params;
        const { error } = TipoQueryValidation.validate({ id_tipo });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const tipo = await getTipoByIdService(Number(id_tipo));
        if (!tipo) {
            return handleErrorClient(res, 404, "Tipo not found");
        }

        return handleSuccess(res, 200, "Tipo retrieved successfully", tipo);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function getTiposController(req, res) {
    try {
        const tipos = await getTiposService();
        return handleSuccess(res, 200, "Tipos retrieved successfully", tipos);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function createTipoController(req, res) {
    try {
        const { error } = TipoBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const newTipo = await createTipoService(req.body);
        return handleSuccess(res, 201, "Tipo created successfully", newTipo);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function updateTipoController(req, res) {
    try {
        const { id_tipo } = req.params;
        const { error } = TipoBodyValidation.validate(req.body);

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const updatedTipo = await updateTipoService(Number(id_tipo), req.body);
        if (!updatedTipo) {
            return handleErrorClient(res, 404, "Tipo not found");
        }

        return handleSuccess(res, 200, "Tipo updated successfully", updatedTipo);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function deleteTipoController(req, res) {
    try {
        const { id_tipo } = req.params;
        const { error } = TipoQueryValidation.validate({ id_tipo });

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const deletedTipo = await deleteTipoService(Number(id_tipo));
        if (!deletedTipo) {
            return handleErrorClient(res, 404, "Tipo not found");
        }

        return handleSuccess(res, 200, "Tipo deleted successfully", deletedTipo);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
