"use strict";
import Joi from "joi";

export const bodegaQueryValidation = Joi.object({
    id_bodega: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID de la bodega debe ser un número entero positivo.",
            "number.integer": "El ID de la bodega debe ser un número entero.",
            "number.positive": "El ID de la bodega debe ser un número positivo."
        }),
    nombre_producto: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .messages({
            "string.base": "El nombre de la bodega debe ser una cadena de texto.",
            "string.min": "El nombre de la bodega debe tener al menos 4 caracteres.",
            "string.max": "El nombre de la bodega no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre de la bodega solo puede contener letras, números y espacios."
        })
});
export const bodegaBodyValidation = Joi.object({
    nombre_producto: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .messages({
            "string.base": "El nombre de la bodega debe ser una cadena de texto.",
            "string.empty": "El nombre de la bodega es obligatorio.",
            "string.min": "El nombre de la bodega debe tener al menos 4 caracteres.",
            "string.max": "El nombre de la bodega no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre de la bodega solo puede contener letras, números y espacios."
        }),
    stock: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El stock debe ser un número entero positivo.",
            "number.integer": "El stock debe ser un número entero.",
            "number.positive": "El stock debe ser un número positivo.",
            "any.required": "El stock es obligatorio."
        }),
    costo_total: Joi.number()
        .precision(2)
        .positive()
        .messages({
            "number.base": "El costo total debe ser un número.",
            "number.precision": "El costo total debe tener hasta 2 decimales.",
            "number.positive": "El costo total debe ser un número positivo.",
            "any.required": "El costo total es obligatorio."
        }),
    tipo_producto: Joi.string()
        .valid("Material", "Relleno", "Producto personalizado","Materia prima", "producto tienda")
        .required()
        .messages({
            "string.base": "El tipo de producto debe ser una cadena de texto.",
            "string.empty": "El tipo de producto es obligatorio.",
            "string.min": "El tipo de producto debe tener al menos 3 caracteres.",
            "string.max": "El tipo de producto no puede exceder los 100 caracteres.",
            "string.pattern.base": "El tipo de producto solo puede contener letras, números y espacios."
        }),
    medida_ancho: Joi.number()
        .precision(2)
        .optional()
        .messages({
            "number.base": "El ancho debe ser un número.",
            "number.precision": "El ancho debe tener hasta 2 decimales."
        }),
    medida_alto: Joi.number()
        .precision(2)
        .optional()
        .messages({
            "number.base": "El alto debe ser un número.",
            "number.precision": "El alto debe tener hasta 2 decimales."
        }),
    medida_espesor: Joi.number()
        .precision(2)
        .optional()
        .messages({
            "number.base": "El espesor debe ser un número.",
            "number.precision": "El espesor debe tener hasta 2 decimales."
        })
    });
