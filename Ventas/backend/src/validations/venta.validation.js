"use strict";
import Joi from "joi";

export const VentaQueryValidation = Joi.object({
    id_venta: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID de la venta debe ser un número entero positivo.",
            "number.integer": "El ID de la venta debe ser un número entero.",
            "number.positive": "El ID de la venta debe ser un número positivo."
        })
});

export const VentaBodyValidation = Joi.object({
    fecha_solicitud: Joi.date()
        .optional()
        .messages({
            "date.base": "La fecha de la venta debe ser una fecha válida.",
            "any.required": "La fecha de la venta es obligatoria."
        }),
    estado_pago: Joi.string()
        .valid("Pendiente", "Pagado", "Cancelado")
        .optional()
        .messages({
            "string.base": "El estado de pago debe ser una cadena de texto.",
            "any.only": "El estado de pago debe ser uno de los siguientes: Pendiente, Pagado, Cancelado.",
            "any.required": "El estado de pago es obligatorio."
        }),
    fecha_pago: Joi.date()
        .optional()
        .messages({
            "date.base": "La fecha de pago debe ser una fecha válida.",
            "any.required": "La fecha de pago es obligatoria."
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
}).required().messages({
    "object.base": "El cuerpo de la solicitud debe ser un objeto.",
    "object.required": "El cuerpo de la solicitud es obligatorio."
});