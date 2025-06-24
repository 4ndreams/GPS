"use strict";
import{
    getVentasService,
    getVentaByIdService,
    createVentaService,
    updateVentaService,
    deleteVentaService
} from "../services/venta.service.js";
import { VentaQueryValidation, VentaBodyValidation } from "../validations/venta.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getVentaController(req, res) {
    try {
        const { id_venta } = req.params;
        const { error } = VentaQueryValidation.validate({ id_venta });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [venta, err] = await getVentaByIdService(Number(id_venta));
        if (err) {
            return handleErrorClient(res, 404, err);
        }

        return handleSuccess(res, 200, "Venta retrieved successfully", venta);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function getVentasController(req, res) {
    try {
        const [ventas, err] = await getVentasService();
        if (err) {
            return handleErrorServer(res, 500, err);
        }
        return handleSuccess(res, 200, "Ventas retrieved successfully", ventas);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function createVentaController(req, res) {
    try {
        const { error } = VentaBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [newVenta, err] = await createVentaService(req.body);
        if (err) {
            return handleErrorServer(res, 500, err);
        }
        return handleSuccess(res, 201, "Venta created successfully", newVenta);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function updateVentaController(req, res) {
    try {
        const { id_venta } = req.params;
        const { error } = VentaBodyValidation.validate(req.body);

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [updatedVenta, err] = await updateVentaService(Number(id_venta), req.body);
        if (err) {
            return handleErrorServer(res, 500, err);
        }
        return handleSuccess(res, 200, "Venta updated successfully", updatedVenta);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function deleteVentaController(req, res) {
    try {
        const { id_venta } = req.params;
        const [deletedVenta, err] = await deleteVentaService(Number(id_venta));
        if (err) {
            return handleErrorClient(res, 404, err);
        }
        return handleSuccess(res, 200, "Venta deleted successfully", deletedVenta);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
