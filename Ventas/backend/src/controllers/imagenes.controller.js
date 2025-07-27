"use strict";

import {
  createImagenService,
  deleteImagenService,
  getImagenByIdService,
  getImagenesService,
  getImagenesByProductoService,
  updateImagenService,
} from "../services/imagenes.service.js";
import {
  ImagenesQueryValidation,
  ImagenesBodyValidation,
  ImagenesProductoQueryValidation,
} from "../validations/imagenes.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { uploadImage } from "../services/uploadImage.service.js"; // ⭐ importamos servicio

export async function getImagenController(req, res) {
  try {
    const { id_img } = req.params;
    const { error } = ImagenesQueryValidation.validate({ id_img });
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

export async function getImagenesByProductoController(req, res) {
  try {
    const { id_producto } = req.params;
    const { error } = ImagenesProductoQueryValidation.validate({ id_producto });
    if (error) {
      return handleErrorClient(res, 400, error.details[0].message);
    }

    const imagenes = await getImagenesByProductoService(Number(id_producto));
    return handleSuccess(res, 200, "Imagenes del producto retrieved successfully", imagenes);
  } catch (error) {
    console.error(error);
    return handleErrorServer(res, 500, "Internal server error");
  }
}

export async function createImagenController(req, res) {
  try {
    let body = req.body;

    // Si viene archivo, lo subimos
    if (req.file) {
      const ruta_imagen = await uploadImage(req.file);
      body.ruta_imagen = ruta_imagen;
    }

    // Convertir string a number si es necesario
    if (typeof body.id_producto === "string") {
      body.id_producto = Number(body.id_producto);
    }

    const { error } = ImagenesBodyValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, error.details[0].message);
    }

    const newImagen = await createImagenService(body);
    return handleSuccess(res, 201, "Imagen created successfully", newImagen);
  } catch (error) {
    console.error(error);
    return handleErrorServer(res, 500, "Internal server error");
  }
}

export async function updateImagenController(req, res) {
  try {
    const { id_img } = req.params;
    let body = req.body;

    // Si quieres permitir reemplazar imagen con nueva subida:
    // if (req.file) {
    //   const ruta_imagen = await uploadImage(req.file);
    //   body.ruta_imagen = ruta_imagen;
    // }

    // Convertir string a número si viene como texto (ej: id_producto)
    if (typeof body.id_producto === "string") {
      body.id_producto = Number(body.id_producto);
    }

    const { error } = ImagenesBodyValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, error.details[0].message);
    }

    const updatedImagen = await updateImagenService(Number(id_img), body);
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
    const deletedImagen = await deleteImagenService(id_img);
    if (!deletedImagen) {
      return handleErrorClient(res, 404, "Imagen not found");
    }

    return handleSuccess(res, 200, "Imagen deleted successfully", deletedImagen);
  } catch (error) {
    console.error(error);
    return handleErrorServer(res, 500, "Internal server error");
  }
}
