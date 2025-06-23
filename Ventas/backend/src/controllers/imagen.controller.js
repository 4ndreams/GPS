"use strict";
import {
    createImagenService,
    getImagenesService,
    getImagenByIdService,
    updateImagenService,
    deleteImagenService
} from "../services/imagen.service.js";
import { ImagenQueryValidation, ImagenBodyValidation } from "../validations/imagen.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getImagenController(req, res) {
    try {
        const { id_img } = req.params;
        const { error } = ImagenQueryValidation.validate({ id_img });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const imagen = await getImagenByIdService(Number(id_img));
        if (!imagen) {
            return handleErrorClient(res, 404, "Imagen not found");
        }

        return handleSuccess(res, 200, "Imagen retrieved successfully", imagen);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}

export async function getImagenesController(req, res) {
    try {
        const imagenes = await getImagenesService();
        return handleSuccess(res, 200, "Imagenes retrieved successfully", imagenes);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function createImagenController(req, res) {
    try {
        const { error } = ImagenBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const newImagen = await createImagenService(req.body);
        return handleSuccess(res, 201, "Imagen created successfully", newImagen);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function updateImagenController(req, res) {
    try {
        const { id_img } = req.params;
        const { error } = ImagenBodyValidation.validate(req.body);

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const updatedImagen = await updateImagenService(Number(id_img), req.body);
        if (!updatedImagen) {
            return handleErrorClient(res, 404, "Imagen not found");
        }

        return handleSuccess(res, 200, "Imagen updated successfully", updatedImagen);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function deleteImagenController(req, res) {
    try {
        const { id_img } = req.params;
        const { error } = ImagenQueryValidation.validate({ id_img });

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const deletedImagen = await deleteImagenService(Number(id_img));
        if (!deletedImagen) {
            return handleErrorClient(res, 404, "Imagen not found");
        }

        return handleSuccess(res, 200, "Imagen deleted successfully", deletedImagen);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
