"use strict";
import Joi from "joi";

export const CompraQueryValidation = Joi.object({
    id_compra: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID de la compra debe ser un número entero positivo.",
            "number.integer": "El ID de la compra debe ser un número entero.",
            "number.positive": "El ID de la compra debe ser un número positivo."
        }),
    nombre_producto: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .messages({
            "string.base": "El nombre del producto debe ser una cadena de texto.",
            "string.min": "El nombre del producto debe tener al menos 4 caracteres.",
            "string.max": "El nombre del producto no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre del producto solo puede contener letras, números y espacios."
        })
});

export const CompraBodyValidation = Joi.object({
    id_bodega: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID de la bodega debe ser un número entero positivo.",
            "number.integer": "El ID de la bodega debe ser un número entero.",
            "number.positive": "El ID de la bodega debe ser un número positivo.",
            "any.required": "El ID de la bodega es obligatorio."
        }),
    nombre_producto: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .optional()
        .messages({
            "string.base": "El nombre del producto debe ser una cadena de texto.",
            "string.empty": "El nombre del producto es obligatorio.",
            "string.min": "El nombre del producto debe tener al menos 4 caracteres.",
            "string.max": "El nombre del producto no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre del producto solo puede contener letras, números y espacios."
        }),
    stock: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El stock debe ser un número entero positivo.",
            "number.integer": "El stock debe ser un número entero.",
            "number.positive": "El stock debe ser un número positivo.",
            "any.required": "El stock es obligatorio."
        }),
    costo_compra: Joi.number()
        .precision(2)
        .positive()
        .optional()
        .messages({
            "number.base": "El costo de compra debe ser un número.",
            "number.precision": "El costo de compra debe tener hasta 2 decimales.",
            "number.positive": "El costo de compra debe ser un número positivo.",
            "any.required": "El costo de compra es obligatorio."
        })
});
