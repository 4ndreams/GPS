"use strict";
import {
    createDespachoService
} from "../services/despacho.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function createDespachoController(req, res) {
    try {
        const { ordenesIds, transportista, observaciones } = req.body;
        
        if (!ordenesIds || !Array.isArray(ordenesIds) || ordenesIds.length === 0) {
            return handleErrorClient(res, 400, "Se requiere al menos una orden para crear el despacho");
        }
        
        if (!transportista) {
            return handleErrorClient(res, 400, "El transportista es requerido");
        }

        const [despacho, err] = await createDespachoService({
            ordenesIds,
            transportista,
            observaciones
        });
        
        if (err) {
            return handleErrorServer(res, 500, err);
        }
        
        return handleSuccess(res, 201, "Despacho created successfully", despacho);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
