"use strict";
import Joi from "joi";

export const ItemCarritoQueryValidation = Joi.object({
    id_item_carrito: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del item del carrito debe ser un número entero positivo.",
            "number.integer": "El ID del item del carrito debe ser un número entero.",
            "number.positive": "El ID del item del carrito debe ser un número positivo."
        }),
    id_producto: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del producto debe ser un número entero positivo.",
            "number.integer": "El ID del producto debe ser un número entero.",
            "number.positive": "El ID del producto debe ser un número positivo."
        }),
    cantidad: Joi.number()
        .integer()
        .min(1)
        .optional()
        .messages({
            "number.base": "La cantidad debe ser un número entero.",
            "number.integer": "La cantidad debe ser un número entero.",
            "number.min": "La cantidad debe ser al menos 1."
        })
});
export const ItemCarritoBodyValidation = Joi.object({
    id_producto: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del producto debe ser un número entero positivo.",
            "number.integer": "El ID del producto debe ser un número entero.",
            "number.positive": "El ID del producto debe ser un número positivo.",
            "any.required": "El ID del producto es obligatorio."
        }),
    cantidad: Joi.number()
        .integer()
        .min(1)
        .optional()
        .messages({
            "number.base": "La cantidad debe ser un número entero.",
            "number.integer": "La cantidad debe ser un número entero.",
            "number.min": "La cantidad debe ser al menos 1.",
            "any.required": "La cantidad es obligatoria."
        }),
    precio: Joi.number()
        .precision(2)
        .positive()
        .optional()
        .messages({
            "number.base": "El precio debe ser un número positivo.",
            "number.positive": "El precio debe ser un número positivo.",
            "number.precision": "El precio debe tener hasta 2 decimales.",
            "any.required": "El precio es obligatorio."
        }),
    id_venta: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID de la venta debe ser un número entero positivo.",
            "number.integer": "El ID de la venta debe ser un número entero.",
            "number.positive": "El ID de la venta debe ser un número positivo.",
            "any.required": "El ID de la venta es obligatorio."
        })
}).required().messages({
    "object.base": "El cuerpo de la solicitud debe ser un objeto.",
    "object.required": "El cuerpo de la solicitud es obligatorio."
});