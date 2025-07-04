"use strict";
import Joi from "joi";

export const RellenoQueryValidation = Joi.object({
    id_relleno: Joi.number()    
    .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del relleno debe ser un número entero positivo.",
            "number.integer": "El ID del relleno debe ser un número entero.",
            "number.positive": "El ID del relleno debe ser un número positivo."
        }),
    nombre_relleno: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s]+$/)
        .optional()
        .messages({
            "string.base": "El nombre del relleno debe ser una cadena de texto.",
            "string.min": "El nombre del relleno debe tener al menos 4 caracteres.",
            "string.max": "El nombre del relleno no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre del relleno solo puede contener letras (incluidas tildes y ñ), números y espacios."
        })
});

export const RellenoBodyValidation = Joi.object({    nombre_relleno: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s]+$/)
        .messages({
            "string.base": "El nombre del relleno debe ser una cadena de texto.",
            "string.empty": "El nombre del relleno es obligatorio.",
            "string.min": "El nombre del relleno debe tener al menos 4 caracteres.",
            "string.max": "El nombre del relleno no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre del relleno solo puede contener letras (incluidas tildes y ñ), números y espacios."
        }),
        caracteristicas: Joi.string()
        .min(10)
        .max(500)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.,;:()\-"'¡!¿?]+$/)
        .optional()
        .messages({
            "string.base": "Las características del relleno deben ser una cadena de texto.",
            "string.min": "Las características del relleno deben tener al menos 10 caracteres.",
            "string.max": "Las características del relleno no pueden exceder los 500 caracteres.",
            "string.pattern.base": "Las características pueden contener letras, números, espacios y signos de puntuación (.,;:()\"'¡!¿?-)."
        })
}).required().messages({
    "object.base": "El cuerpo de la solicitud debe ser un objeto.",
    "object.required": "El cuerpo de la solicitud es obligatorio."
});
    