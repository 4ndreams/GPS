"use strict";
import {
    CompraQueryValidation,
    CompraBodyValidation
} from "../validations/compras.validation.js";
import {
    getComprasService,
    getCompraByIdService,
    createCompraService,
    updateCompraService,
    deleteCompraService
} from "../services/compra.service.js";

import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getCompraController(req, res) {
    try {
        const { id_compra } = req.params;
        const { error } = CompraQueryValidation.validate({ id_compra });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const compra = await getCompraByIdService(Number(id_compra));
        if (!compra) {
            return handleErrorClient(res, 404, "Compra not found");
        }

        return handleSuccess(res, 200, "Compra retrieved successfully", compra);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function getComprasController(req, res) {
    try {
        const compras = await getComprasService();
        return handleSuccess(res, 200, "Compras retrieved successfully", compras);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function createCompraController(req, res) {
    try {
        const { error } = CompraBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const newCompra = await createCompraService(req.body);
        return handleSuccess(res, 201, "Compra created successfully", newCompra);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function updateCompraController(req, res) {
    try {
        
        const { id_compra } = req.params;
        const { error } = CompraBodyValidation.validate(req.body);

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }
        const updatedCompra = await updateCompraService(id_compra, req.body);
        if (!updatedCompra) {
            return handleErrorClient(res, 404, "Compra not found");
        }

        return handleSuccess(res, 200, "Compra updated successfully", updatedCompra);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function deleteCompraController(req, res) {
    try {
        const { id_compra } = req.params;
        const { error } = CompraQueryValidation.validate({ id_compra });

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const deletedCompra = await deleteCompraService(Number(id_compra));
        if (!deletedCompra) {
            return handleErrorClient(res, 404, "Compra not found");
        }

        return handleSuccess(res, 200, "Compra deleted successfully", deletedCompra);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
