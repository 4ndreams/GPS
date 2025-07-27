"use strict";
import Joi from "joi";

export const PhotoQueryValidation = Joi.object({
    id_pht: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID de la photo debe ser un número entero positivo.",
            "number.integer": "El ID de la photo debe ser un número entero.",
            "number.positive": "El ID de la photo debe ser un número positivo."
        }),
    ruta_imagen: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s\/_.-]+$/)
        .optional()
        .messages({
            "string.base": "La ruta de la photo debe ser una cadena de texto.",
            "string.min": "La ruta de la photo debe tener al menos 4 caracteres.",
            "string.max": "La ruta de la photo no puede exceder los 255 caracteres.",
            "string.pattern.base": "La ruta de la photo solo puede contener letras, números, espacios, guiones bajos, guiones y puntos."
        })
});

export const PhotoBodyValidation = Joi.object({
    ruta_imagen: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s\/_.-]+$/)
        .messages({
            "string.base": "La ruta de la photo debe ser una cadena de texto.",
            "string.empty": "La ruta de la photo es obligatoria.",
            "string.min": "La ruta de la photo debe tener al menos 4 caracteres.",
            "string.max": "La ruta de la photo no puede exceder los 255 caracteres.",
            "string.pattern.base": "La ruta de la photo solo puede contener letras, números, espacios, guiones bajos, guiones y puntos."
        }),
    id_orden: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El ID de la orden debe ser un número entero positivo.",
            "number.integer": "El ID de la orden debe ser un número entero.",
            "number.positive": "El ID de la orden debe ser un número positivo.",
            "any.required": "El ID de la orden es obligatorio."
        })
}).required().messages({
    "object.base": "El cuerpo de la solicitud debe ser un objeto.",
    "object.required": "El cuerpo de la solicitud es obligatorio."
});
