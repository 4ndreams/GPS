"use strict";
import {
    getItemsCarritoService,
    getItemCarritoByIdService,
    createItemCarritoService,
    updateItemCarritoService,
    deleteItemCarritoService
} from "../services/item_carrito.service.js";
import { ItemCarritoQueryValidation, ItemCarritoBodyValidation } from "../validations/item_carrito.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getItemCarritoController(req, res) {
    try {
        const { id_item_carrito } = req.params;
        const { error } = ItemCarritoQueryValidation.validate({ id_item_carrito });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const itemCarrito = await getItemCarritoByIdService(Number(id_item_carrito));
        if (!itemCarrito) {
            return handleErrorClient(res, 404, "Item Carrito not found");
        }

        return handleSuccess(res, 200, "Item Carrito retrieved successfully", itemCarrito);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function getItemsCarritoController(req, res) {
    try {
        const itemsCarrito = await getItemsCarritoService();
        return handleSuccess(res, 200, "Items Carrito retrieved successfully", itemsCarrito);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function createItemCarritoController(req, res) {
    try {
        const { error } = ItemCarritoBodyValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const newItemCarrito = await createItemCarritoService(req.body);
        return handleSuccess(res, 201, "Item Carrito created successfully", newItemCarrito);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function updateItemCarritoController(req, res) {
    try {
        const { id_item_carrito } = req.params;
        const { error } = ItemCarritoBodyValidation.validate(req.body);

        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const updatedItemCarrito = await updateItemCarritoService(Number(id_item_carrito), req.body);
        if (!updatedItemCarrito) {
            return handleErrorClient(res, 404, "Item Carrito not found");
        }

        return handleSuccess(res, 200, "Item Carrito updated successfully", updatedItemCarrito);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
export async function deleteItemCarritoController(req, res) {
    try {
        const { id_item_carrito } = req.params;
        const { error } = ItemCarritoQueryValidation.validate({ id_item_carrito });
        if (error) {
            return handleErrorClient(res, 400, error.details[0].message);
        }

        const deletedItemCarrito = await deleteItemCarritoService(Number(id_item_carrito));
        if (!deletedItemCarrito) {
            return handleErrorClient(res, 404, "Item Carrito not found");
        }

        return handleSuccess(res, 200, "Item Carrito deleted successfully", deletedItemCarrito);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Internal server error");
    }
}
