"use strict";
import{
    getProductosService,
    getProductoByIdService,
    createProductoService,
    updateProductoService,
    deleteProductoService
} from "../services/producto.service.js";
import { ProductoQueryValidation, ProductoBodyValidation } from "../validations/producto.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getProductoController(req, res) {
    try {
        const { id_producto } = req.params;
        const { error } = ProductoQueryValidation.validate({ id_producto });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const producto = await getProductoByIdService(Number(id_producto));
        if (!producto) {
            return handleErrorClient(res, 404, "Producto not found");
        }

        return handleSuccess(res, 200, "Producto retrieved successfully", producto);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function getProductosController(req, res) {
    try {
        const productos = await getProductosService();
        return handleSuccess(res, 200, "Productos retrieved successfully", productos);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function createProductoController(req, res) {
    try {
        const { error } = ProductoBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const newProducto = await createProductoService(req.body);
        return handleSuccess(res, 201, "Producto created successfully", newProducto);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function updateProductoController(req, res) {
    try {
        const { id_producto } = req.params;
        const { error } = ProductoBodyValidation.validate(req.body);

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const updatedProducto = await updateProductoService(Number(id_producto), req.body);
        if (!updatedProducto) {
            return handleErrorClient(res, 404, "Producto not found");
        }

        return handleSuccess(res, 200, "Producto updated successfully", updatedProducto);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function deleteProductoController(req, res) {
    try {
        const { id_producto } = req.params;
        const { error } = ProductoQueryValidation.validate({ id_producto });

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const deletedProducto = await deleteProductoService(Number(id_producto));
        if (!deletedProducto) {
            return handleErrorClient(res, 404, "Producto not found");
        }

        return handleSuccess(res, 200, "Producto deleted successfully", deletedProducto);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
