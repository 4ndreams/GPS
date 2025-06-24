"use strict";
import Joi from "joi";

export const OrdenQueryValidation = Joi.object({
    id_orden: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID de la orden debe ser un número entero positivo.",
            "number.integer": "El ID de la orden debe ser un número entero.",
            "number.positive": "El ID de la orden debe ser un número positivo."
        }),
    estado: Joi.string()
        .valid("Pendiente", "Enviado", "Entregado", "Cancelado")
        .optional()
        .messages({
            "string.base": "El estado de la orden debe ser una cadena de texto.",
            "any.only": "El estado de la orden debe ser uno de los siguientes: Pendiente, Enviado, Entregado, Cancelado."
        })
});

export const OrdenBodyValidation = Joi.object({
    cantidad: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "La cantidad debe ser un número entero positivo.",
            "number.integer": "La cantidad debe ser un número entero.",
            "number.positive": "La cantidad debe ser un número positivo.",
            "any.required": "La cantidad es obligatoria."
        }),
    origen: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .optional()
        .messages({
            "string.base": "El origen debe ser una cadena de texto.",
            "string.empty": "El origen es obligatorio.",
            "string.min": "El origen debe tener al menos 4 caracteres.",
            "string.max": "El origen no puede exceder los 255 caracteres.",
            "string.pattern.base": "El origen solo puede contener letras, números y espacios."
        }),
    destino: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .optional()
        .messages({
            "string.base": "El destino debe ser una cadena de texto.",
            "string.empty": "El destino es obligatorio.",
            "string.min": "El destino debe tener al menos 4 caracteres.",
            "string.max": "El destino no puede exceder los 255 caracteres.",
            "string.pattern.base": "El destino solo puede contener letras, números y espacios."
        }),
    fecha_envio: Joi.date()
        .iso()
        .optional()
        .messages({
            "date.base": "La fecha de envío debe ser una fecha válida.",
            "date.format": "La fecha de envío debe estar en formato ISO 8601.",
            "any.required": "La fecha de envío es obligatoria."
        }),
    estado: Joi.string()
        .valid("Pendiente", "Enviado", "Entregado", "Cancelado")
        .default("Pendiente")
        .messages({
            "string.base": "El estado de la orden debe ser una cadena de texto.",
            "any.only": "El estado de la orden debe ser uno de los siguientes: Pendiente, Enviado, Entregado, Cancelado."
        }),
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
    id_usuario: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del usuario debe ser un número entero positivo.",
            "number.integer": "El ID del usuario debe ser un número entero.",
            "number.positive": "El ID del usuario debe ser un número positivo.",
            "any.required": "El ID del usuario es obligatorio."
        })
});