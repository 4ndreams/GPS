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
        .valid("Pendiente", "En producción", "Fabricada", "En tránsito", "Recibido", "Recibido con problemas", "Cancelado")
        .optional()
        .messages({
            "string.base": "El estado de la orden debe ser una cadena de texto.",
            "any.only": "El estado de la orden debe ser uno de los siguientes: Pendiente, En producción, Fabricada, En tránsito, Recibido, Recibido con problemas, Cancelado."
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
        .valid("Pendiente", "En producción", "Fabricada", "En tránsito", "Recibido", "Recibido con problemas", "Cancelado")
        .default("Pendiente")
        .messages({
            "string.base": "El estado de la orden debe ser una cadena de texto.",
            "any.only": "El estado de la orden debe ser uno de los siguientes: Pendiente, En producción, Fabricada, En tránsito, Recibido, Recibido con problemas, Cancelado."
        }),
    prioridad: Joi.string()
        .valid("Baja", "Media", "Alta", "Urgente")
        .default("Media")
        .optional()
        .messages({
            "string.base": "La prioridad debe ser una cadena de texto.",
            "any.only": "La prioridad debe ser uno de los siguientes: Baja, Media, Alta, Urgente."
        }),
    transportista: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .allow(null)
        .messages({
            "string.base": "El transportista debe ser una cadena de texto.",
            "string.min": "El transportista debe tener al menos 3 caracteres.",
            "string.max": "El transportista no puede exceder los 255 caracteres."
        }),
    tipo: Joi.string()
        .valid("normal", "stock")
        .default("normal")
        .optional()
        .messages({
            "string.base": "El tipo debe ser una cadena de texto.",
            "any.only": "El tipo debe ser 'normal' o 'stock'."
        }),
    observaciones: Joi.string()
        .max(500)
        .optional()
        .allow(null)
        .messages({
            "string.base": "Las observaciones deben ser una cadena de texto.",
            "string.max": "Las observaciones no pueden exceder los 500 caracteres."
        }),
    fecha_entrega: Joi.date()
        .iso()
        .optional()
        .allow(null)
        .messages({
            "date.base": "La fecha de entrega debe ser una fecha válida.",
            "date.format": "La fecha de entrega debe estar en formato ISO 8601."
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
        }),
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
    foto_despacho: Joi.string()
        .optional()
        .allow(null)
        .messages({
            "string.base": "La foto del despacho debe ser una cadena de texto."
        })
});