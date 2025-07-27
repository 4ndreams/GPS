"use strict";
import {
    createPhotoService,
    getPhotosService,
    getPhotoByIdService,
    updatePhotoService,
    deletePhotoService
} from "../services/photo.service.js";
import { PhotoQueryValidation, PhotoBodyValidation } from "../validations/photo.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getPhotoController(req, res) {
    try {
        const { id_pht } = req.params;
        const { error } = PhotoQueryValidation.validate({ id_pht });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [photo, serviceError] = await getPhotoByIdService(Number(id_pht));
        if (serviceError) {
            return handleErrorClient(res, 404, serviceError);
        }

        return handleSuccess(res, 200, "Photo retrieved successfully", photo);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function getPhotosController(req, res) {
    try {
        const [photos, error] = await getPhotosService();
        if (error) {
            return handleErrorServer(res, 500, error);
        }
        return handleSuccess(res, 200, "Photos retrieved successfully", photos);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function createPhotoController(req, res) {
    try {
        // Validar que vengan tanto el archivo como el id_orden
        if (!req.file) {
            return handleErrorClient(res, 400, "No se proporcionó archivo de imagen");
        }

        if (!req.body.id_orden) {
            return handleErrorClient(res, 400, "El ID de la orden es requerido");
        }

        // Convertir string a number si es necesario
        const id_orden = parseInt(req.body.id_orden);
        if (isNaN(id_orden)) {
            return handleErrorClient(res, 400, "El ID de la orden debe ser un número válido");
        }

        // Crear photo usando el servicio integrado (MinIO + DB)
        const [newPhoto, error] = await createPhotoService(req.file, id_orden);
        
        if (error) {
            return handleErrorServer(res, 500, error);
        }

        return handleSuccess(res, 201, "Photo created successfully", newPhoto);
    } catch (error) {
        console.error("Error en createPhotoController:", error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function updatePhotoController(req, res) {
    try {
        const { id_pht } = req.params;
        
        // Para actualización, no requerimos archivo ni id_orden
        const body = req.body;

        // Si viene archivo, crear nueva photo (update con archivo es reemplazar)
        if (req.file && body.id_orden) {
            const id_orden = parseInt(body.id_orden);
            if (isNaN(id_orden)) {
                return handleErrorClient(res, 400, "El ID de la orden debe ser un número válido");
            }

            const [updatedPhoto, error] = await createPhotoService(req.file, id_orden);
            
            if (error) {
                return handleErrorServer(res, 500, error);
            }

            return handleSuccess(res, 200, "Photo updated successfully", updatedPhoto);
        }

        // Solo actualizar campos sin archivo
        const { error: validationError } = PhotoBodyValidation.validate(body);
        if (validationError) {
            return handleErrorClient(res, 400, validationError.details[0].message);
        }

        const [updatedPhoto, error] = await updatePhotoService(Number(id_pht), body);
        if (error) {
            return handleErrorClient(res, 404, error);
        }

        return handleSuccess(res, 200, "Photo updated successfully", updatedPhoto);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function deletePhotoController(req, res) {
    try {
        const { id_pht } = req.params;
        const { error } = PhotoQueryValidation.validate({ id_pht });

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [deletedPhoto, serviceError] = await deletePhotoService(Number(id_pht));
        if (serviceError) {
            return handleErrorClient(res, 404, serviceError);
        }

        return handleSuccess(res, 200, "Photo deleted successfully", deletedPhoto);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
