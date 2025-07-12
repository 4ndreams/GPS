"use strict";
import Joi from "joi";

export const ProductoQueryValidation = Joi.object({
    id_producto: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del producto debe ser un número entero positivo.",
            "number.integer": "El ID del producto debe ser un número entero.",
            "number.positive": "El ID del producto debe ser un número positivo."
        }),
    nombre_producto: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .optional()
        .messages({
            "string.base": "El nombre del producto debe ser una cadena de texto.",
            "string.min": "El nombre del producto debe tener al menos 4 caracteres.",
            "string.max": "El nombre del producto no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre del producto solo puede contener letras, números y espacios."
        })
});
export const ProductoBodyValidation = Joi.object({
    nombre_producto: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .messages({
            "string.base": "El nombre del producto debe ser una cadena de texto.",
            "string.empty": "El nombre del producto es obligatorio.",
            "string.min": "El nombre del producto debe tener al menos 4 caracteres.",
            "string.max": "El nombre del producto no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre del producto solo puede contener letras, números y espacios."
        }),
    descripcion: Joi.string()
        .min(10)
        .max(500)
        .optional()
        .messages({
            "string.base": "La descripción del producto debe ser una cadena de texto.",
            "string.min": "La descripción del producto debe tener al menos 10 caracteres.",
            "string.max": "La descripción del producto no puede exceder los 500 caracteres."
        }),
    precio: Joi.number()
        .precision(2)   
        .positive()
        .messages({
            "number.base": "El precio debe ser un número.",
            "number.precision": "El precio debe tener hasta 2 decimales.",
            "number.positive": "El precio debe ser un número positivo.",
            "any.required": "El precio es obligatorio."
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
        descripcion: Joi.string()
        .min(10)
        .max(500)
        .optional()
        .messages({
            "string.base": "La descripción del producto debe ser una cadena de texto.",
            "string.min": "La descripción del producto debe tener al menos 10 caracteres.",
            "string.max": "La descripción del producto no puede exceder los 500 caracteres."
        }),
        medida_ancho: Joi.number()
        .precision(2)
        .positive()
        .messages({
            "number.base": "El ancho debe ser un número.",
            "number.precision": "El ancho debe tener hasta 2 decimales.",
            "number.positive": "El ancho debe ser un número positivo.",
            "any.required": "El ancho es obligatorio."
        }),
        medida_largo: Joi.number()
        .precision(2)
        .positive()
        .messages({
            "number.base": "El largo debe ser un número.",
            "number.precision": "El largo debe tener hasta 2 decimales.",
            "number.positive": "El largo debe ser un número positivo.",
            "any.required": "El largo es obligatorio."
        }),
        medida_alto: Joi.number()
        .precision(2)
        .positive()
        .messages({
            "number.base": "El alto debe ser un número.",
            "number.precision": "El alto debe tener hasta 2 decimales.",
            "number.positive": "El alto debe ser un número positivo.",
            "any.required": "El alto es obligatorio."
        }),
    id_material: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El ID del material debe ser un número entero positivo.",
            "number.integer": "El ID del material debe ser un número entero.",
            "number.positive": "El ID del material debe ser un número positivo.",
            "any.required": "El ID del material es obligatorio."
        }),
    id_tipo: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El ID del tipo debe ser un número entero positivo.",
            "number.integer": "El ID del tipo debe ser un número entero.",
            "number.positive": "El ID del tipo debe ser un número positivo.",
            "any.required": "El ID del tipo es obligatorio."
        }),
    id_relleno: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del relleno debe ser un número entero positivo.",
            "number.integer": "El ID del relleno debe ser un número entero.",
            "number.positive": "El ID del relleno debe ser un número positivo."
        })
}).required().messages({
    "object.base": "El cuerpo de la solicitud debe ser un objeto.",
    "object.required": "El cuerpo de la solicitud es obligatorio."
});