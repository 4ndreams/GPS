"use strict";
import Joi from "joi";

export const MaterialQueryValidation = Joi.object({
    id_material: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del material debe ser un número entero positivo.",
            "number.integer": "El ID del material debe ser un número entero.",
            "number.positive": "El ID del material debe ser un número positivo."
        }),
    nombre_material: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .optional()
        .messages({
            "string.base": "El nombre del material debe ser una cadena de texto.",
            "string.min": "El nombre del material debe tener al menos 4 caracteres.",
            "string.max": "El nombre del material no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre del material solo puede contener letras, números y espacios."
        })
});

export const MaterialBodyValidation = Joi.object({
    nombre_material: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .messages({
            "string.base": "El nombre del material debe ser una cadena de texto.",
            "string.empty": "El nombre del material es obligatorio.",
            "string.min": "El nombre del material debe tener al menos 4 caracteres.",
            "string.max": "El nombre del material no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre del material solo puede contener letras, números y espacios."
        }),
        caracteristicas: Joi.string()
        .min(10)
        .max(500)
        .optional()
        .messages({
            "string.base": "Las características del material deben ser una cadena de texto.",
            "string.min": "Las características del material deben tener al menos 10 caracteres.",
            "string.max": "Las características del material no pueden exceder los 500 caracteres."
        })
}).required().messages({
    "object.base": "El cuerpo de la solicitud debe ser un objeto.",
    "object.required": "El cuerpo de la solicitud es obligatorio."
});
    