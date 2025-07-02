"use strict";
import{
    getProductosPersonalizadosService,
    getProductosPersonalizadosByUserService,
    getProductoPersonalizadoByIdService,
    createProductoPersonalizadoService,
    updateProductoPersonalizadoService,
    updateEstadoProductoPersonalizadoService,
    deleteProductoPersonalizadoService
} from "../services/producto_personalizado.service.js";
import { ProductoPersonalizadoQueryValidation, ProductoPersonalizadoBodyValidation, ProductoPersonalizadoEstadoValidation } from "../validations/producto_personalizado.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getProductoPersonalizadoController(req, res) {
    try {
        const { id_producto_personalizado } = req.params;
        const { error } = ProductoPersonalizadoQueryValidation.validate({ id_producto_personalizado });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [productoPersonalizado, errorMessage] = await getProductoPersonalizadoByIdService(Number(id_producto_personalizado));
        
        if (errorMessage) {
            return handleErrorClient(res, 404, errorMessage);
        }

        return handleSuccess(res, 200, "Producto personalizado obtenido exitosamente", productoPersonalizado);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Error interno del servidor");
    }
}

export async function getProductosPersonalizadosController(req, res) {
    try {
        const [productosPersonalizados, errorMessage] = await getProductosPersonalizadosService();
        
        if (errorMessage) {
            return handleErrorClient(res, 404, errorMessage);
        }

        return handleSuccess(res, 200, "Productos personalizados obtenidos exitosamente", productosPersonalizados);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Error interno del servidor");
    }
}

export async function createProductoPersonalizadoController(req, res) {
    try {
        // Si el usuario está logueado, asignar automáticamente su ID
        if (req.user && req.user.id_usuario) {
            req.body.id_usuario = req.user.id_usuario;
        } 


        const { error } = ProductoPersonalizadoBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [newProductoPersonalizado, errorMessage] = await createProductoPersonalizadoService(req.body);
        
        if (errorMessage) {
            return handleErrorServer(res, 500, errorMessage);
        }

        return handleSuccess(res, 201, "Producto personalizado creado exitosamente", newProductoPersonalizado);
    } catch (error) {
        return handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
}

export async function updateProductoPersonalizadoController(req, res) { 
    try {
        const { id_producto_personalizado } = req.params;
        
        // Si el usuario está logueado, asignar automáticamente su ID
        if (req.user && req.user.id_usuario) {
            req.body.id_usuario = req.user.id_usuario;
        }

        const { error } = ProductoPersonalizadoBodyValidation.validate(req.body);

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [updatedProductoPersonalizado, errorMessage] = await updateProductoPersonalizadoService(Number(id_producto_personalizado), req.body);
        
        if (errorMessage) {
            return handleErrorClient(res, 404, errorMessage);
        }

        return handleSuccess(res, 200, "Producto personalizado actualizado exitosamente", updatedProductoPersonalizado);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Error interno del servidor");
    }
}

export async function deleteProductoPersonalizadoController(req, res) { 
    try {
        const { id_producto_personalizado } = req.params;
        const { error } = ProductoPersonalizadoQueryValidation.validate({ id_producto_personalizado });

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [deletedProductoPersonalizado, errorMessage] = await deleteProductoPersonalizadoService(Number(id_producto_personalizado));
        
        if (errorMessage) {
            return handleErrorClient(res, 404, errorMessage);
        }

        return handleSuccess(res, 200, "Producto personalizado eliminado exitosamente", deletedProductoPersonalizado);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Error interno del servidor");
    }
}

export async function getProductosPersonalizadosByUserController(req, res) {
    try {
        const { id_usuario, rut_contacto } = req.query;

        // Validar los parámetros de consulta
        const { error } = ProductoPersonalizadoQueryValidation.validate({ id_usuario, rut_contacto });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const [productosPersonalizados, errorMessage] = await getProductosPersonalizadosByUserService(id_usuario, rut_contacto);
        
        if (errorMessage) {
            return handleErrorClient(res, 404, errorMessage);
        }

        return handleSuccess(res, 200, "Productos personalizados obtenidos exitosamente", productosPersonalizados);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Error interno del servidor");
    }
}

export async function updateEstadoProductoPersonalizadoController(req, res) {
    try {
        const { id_producto_personalizado } = req.params;
        const { estado } = req.body;

        // Validar el ID del producto personalizado
        const idValidation = ProductoPersonalizadoQueryValidation.validate({ id_producto_personalizado });
        if (idValidation.error) {
            return handleErrorClient(res, 400, idValidation.error.details[0].message);
        }

        // Validar el estado
        const estadoValidation = ProductoPersonalizadoEstadoValidation.validate({ estado });
        if (estadoValidation.error) {
            return handleErrorClient(res, 400, estadoValidation.error.details[0].message);
        }

        const [updatedProductoPersonalizado, errorMessage] = await updateEstadoProductoPersonalizadoService(Number(id_producto_personalizado), estado);
        
        if (errorMessage) {
            return handleErrorClient(res, 404, errorMessage);
        }

        return handleSuccess(res, 200, "Estado del producto personalizado actualizado exitosamente", updatedProductoPersonalizado);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Error interno del servidor");
    }
}

