"use strict";
import Joi from "joi";

export const TipoQueryValidation = Joi.object({
    id_tipo: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del tipo debe ser un número entero positivo.",
            "number.integer": "El ID del tipo debe ser un número entero.",
            "number.positive": "El ID del tipo debe ser un número positivo."
        }),
    nombre_tipo: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .optional()
        .messages({
            "string.base": "El nombre del tipo debe ser una cadena de texto.",
            "string.min": "El nombre del tipo debe tener al menos 4 caracteres.",
            "string.max": "El nombre del tipo no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre del tipo solo puede contener letras, números y espacios."
        })
});

export const TipoBodyValidation = Joi.object({
    nombre_tipo: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .messages({
            "string.base": "El nombre del tipo debe ser una cadena de texto.",
            "string.empty": "El nombre del tipo es obligatorio.",
            "string.min": "El nombre del tipo debe tener al menos 4 caracteres.",
            "string.max": "El nombre del tipo no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre del tipo solo puede contener letras, números y espacios."
        }),
    descripcion: Joi.string()
        .min(10)
        .max(500)
        .optional()
        .messages({
            "string.base": "La descripción del tipo debe ser una cadena de texto.",
            "string.min": "La descripción del tipo debe tener al menos 10 caracteres.",
            "string.max": "La descripción del tipo no puede exceder los 500 caracteres."
        })
}).required().messages({
    "object.base": "El cuerpo de la solicitud debe ser un objeto.",
    "object.required": "El cuerpo de la solicitud es obligatorio."
});