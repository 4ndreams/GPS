"use strict";
import Joi from "joi";
import RutValidator from "./rut.validation.js";

const domainEmailValidator = (value, helper) => {
  const allowedDomains = ["@gmail.com", "@hotmail.com", "@outlook.com", "@yahoo.com", "@gmail.cl"];
  
  if (!allowedDomains.some(domain => value.endsWith(domain))) {
    return helper.message(`El email electrónico debe finalizar en uno de los siguientes dominios: ${allowedDomains.join(", ")}.`);
  }
  
  return value;
};

const rutValidator = (value, helper) => {
  if (!RutValidator.isValidRut(value)) {
    return helper.message("El RUT ingresado no es válido.");
  }
  return value;
};

export const ProductoPersonalizadoQueryValidation = Joi.object({
    id_producto_personalizado: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El ID del producto personalizado debe ser un número entero positivo.",
            "number.integer": "El ID del producto personalizado debe ser un número entero.",
            "number.positive": "El ID del producto personalizado debe ser un número positivo."
        }),
    id_relleno: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del relleno debe ser un número entero positivo.",
            "number.integer": "El ID del relleno debe ser un número entero.",
            "number.positive": "El ID del relleno debe ser un número positivo."
        }),
    id_material: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del material debe ser un número entero positivo.",
            "number.integer": "El ID del material debe ser un número entero.",
            "number.positive": "El ID del material debe ser un número positivo."
        }),
    id_usuario: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del usuario debe ser un número entero positivo.",
            "number.integer": "El ID del usuario debe ser un número entero.",
            "number.positive": "El ID del usuario debe ser un número positivo."
        }),
    rut_contacto: Joi.string()
        .pattern(/^\d{1,8}-[\dkK]$/)
        .custom(rutValidator)
        .optional()
        .messages({
            "string.base": "El RUT debe ser una cadena de texto.",
            "string.pattern.base": "El RUT debe tener el formato correcto (ej: 12345678-9)."
        }),
});

export const ProductoPersonalizadoBodyValidation = Joi.object({
    id_relleno: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID del relleno debe ser un número entero positivo.",
            "number.integer": "El ID del relleno debe ser un número entero.",
            "number.positive": "El ID del relleno debe ser un número positivo.",
            "any.required": "El ID del relleno es obligatorio."
        }),
    id_material: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID del material debe ser un número entero positivo.",
            "number.integer": "El ID del material debe ser un número entero.",
            "number.positive": "El ID del material debe ser un número positivo.",
            "any.required": "El ID del material es obligatorio."
        }),
    id_usuario: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del usuario debe ser un número entero positivo.",
            "number.integer": "El ID del usuario debe ser un número entero.",
            "number.positive": "El ID del usuario debe ser un número positivo."
        }),
    medida_ancho: Joi.number()
        .precision(2)
        .min(10)
        .max(150)
        .required()
        .messages({
            "number.base": "El ancho debe ser un número.",
            "number.min": "El ancho debe ser al menos 10 centímetros.",
            "number.max": "El ancho no puede exceder 150 centímetros.",
            "number.precision": "El ancho puede tener máximo 2 decimales.",
            "any.required": "El ancho es obligatorio."
        }),
    medida_alto: Joi.number()
        .precision(2)
        .min(10)
        .max(225)
        .required()
        .messages({
            "number.base": "El alto debe ser un número.",
            "number.min": "El alto debe ser al menos 10 centímetros.",
            "number.max": "El alto no puede exceder 225 centímetros.",
            "number.precision": "El alto puede tener máximo 2 decimales.",
            "any.required": "El alto es obligatorio."
        }),
    medida_largo: Joi.number()
        .precision(2)
        .min(10)
        .max(300)
        .required()
        .messages({
            "number.base": "El largo debe ser un número.",
            "number.min": "El largo debe ser al menos 10 centímetros.",
            "number.max": "El largo no puede exceder 300 centímetros.",
            "number.precision": "El largo puede tener máximo 2 decimales.",
            "any.required": "El largo es obligatorio."
        }),
    nombre_apellido_contacto: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
        .required()
        .messages({
            "string.base": "El nombre y apellido de contacto debe ser una cadena de texto.",
            "string.min": "El nombre y apellido de contacto debe tener al menos 4 caracteres.",
            "string.max": "El nombre y apellido de contacto no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre y apellido de contacto solo puede contener letras, espacios y caracteres especiales del español (tildes, ñ, ü).",
            "any.required": "El nombre y apellido de contacto es obligatorio."
        }),
    rut_contacto: Joi.string()
        .pattern(/^\d{1,8}-[\dkK]$/)
        .custom(rutValidator)
        .required()
        .messages({
            "string.base": "El RUT debe ser una cadena de texto.",
            "string.pattern.base": "El RUT debe tener el formato correcto (ej: 12345678-9).",
            "any.required": "El RUT de contacto es obligatorio."
        }),
    email_contacto: Joi.string()
        .email()
        .custom(domainEmailValidator)
        .required()
        .messages({
            "any.required": "El email de contacto es obligatorio."
        }),
    telefono_contacto: Joi.string()
        .pattern(/^\d+$/)
        .max(8)
        .required()
        .messages({
            "string.base": "El teléfono de contacto debe ser una cadena de texto.",
            "string.pattern.base": "El teléfono de contacto solo puede contener números sin espacios.",
            "string.max": "El teléfono de contacto no puede exceder los 8 caracteres.",
            "any.required": "El teléfono de contacto es obligatorio."
        }),
    mensaje: Joi.string()
        .min(5)
        .max(500)
        .required()
        .messages({
            "string.base": "El mensaje debe ser una cadena de texto.",
            "string.min": "El mensaje debe tener al menos 5 caracteres.",
            "string.max": "El mensaje no puede exceder los 500 caracteres.",
            "any.required": "El mensaje es obligatorio."
        }),
    estado: Joi.string()
        .valid("Solicitud Recibida", "En Proceso", "Lista para retirar")
        .optional()
        .messages({
            "string.base": "El estado debe ser una cadena de texto.",
            "any.only": "El estado debe ser uno de: 'Solicitud Recibida', 'En Proceso', 'Lista para retirar'."
        })
});

// Validación específica para actualizar solo el estado
export const ProductoPersonalizadoEstadoValidation = Joi.object({
    estado: Joi.string()
        .valid("Solicitud Recibida", "En Proceso", "Lista para retirar")
        .required()
        .messages({
            "string.base": "El estado debe ser una cadena de texto.",
            "any.only": "El estado debe ser uno de: 'Solicitud Recibida', 'En Proceso', 'Lista para retirar'.",
            "any.required": "El estado es obligatorio."
        })
});

// Validación para usuarios logueados (campos de contacto opcionales)
export const ProductoPersonalizadoBodyValidationLoggedUser = Joi.object({
    id_relleno: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID del relleno debe ser un número entero positivo.",
            "number.integer": "El ID del relleno debe ser un número entero.",
            "number.positive": "El ID del relleno debe ser un número positivo.",
            "any.required": "El ID del relleno es obligatorio."
        }),
    id_material: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El ID del material debe ser un número entero positivo.",
            "number.integer": "El ID del material debe ser un número entero.",
            "number.positive": "El ID del material debe ser un número positivo.",
            "any.required": "El ID del material es obligatorio."
        }),
    id_usuario: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El ID del usuario debe ser un número entero positivo.",
            "number.integer": "El ID del usuario debe ser un número entero.",
            "number.positive": "El ID del usuario debe ser un número positivo."
        }),
    medida_ancho: Joi.number()
        .precision(2)
        .min(10)
        .max(150)
        .required()
        .messages({
            "number.base": "El ancho debe ser un número.",
            "number.min": "El ancho debe ser al menos 10 centímetros.",
            "number.max": "El ancho no puede exceder 150 centímetros.",
            "number.precision": "El ancho puede tener máximo 2 decimales.",
            "any.required": "El ancho es obligatorio."
        }),
    medida_alto: Joi.number()
        .precision(2)
        .min(10)
        .max(225)
        .required()
        .messages({
            "number.base": "El alto debe ser un número.",
            "number.min": "El alto debe ser al menos 10 centímetros.",
            "number.max": "El alto no puede exceder 225 centímetros.",
            "number.precision": "El alto puede tener máximo 2 decimales.",
            "any.required": "El alto es obligatorio."
        }),
    medida_largo: Joi.number()
        .precision(2)
        .min(10)
        .max(300)
        .required()
        .messages({
            "number.base": "El largo debe ser un número.",
            "number.min": "El largo debe ser al menos 10 centímetros.",
            "number.max": "El largo no puede exceder 300 centímetros.",
            "number.precision": "El largo puede tener máximo 2 decimales.",
            "any.required": "El largo es obligatorio."
        }),
    nombre_apellido_contacto: Joi.string()
        .min(4)
        .max(255)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
        .optional()
        .messages({
            "string.base": "El nombre y apellido de contacto debe ser una cadena de texto.",
            "string.min": "El nombre y apellido de contacto debe tener al menos 4 caracteres.",
            "string.max": "El nombre y apellido de contacto no puede exceder los 255 caracteres.",
            "string.pattern.base": "El nombre y apellido de contacto solo puede contener letras, espacios y caracteres especiales del español (tildes, ñ, ü)."
        }),
    rut_contacto: Joi.string()
        .pattern(/^\d{1,8}-[\dkK]$/)
        .custom(rutValidator)
        .optional()
        .messages({
            "string.base": "El RUT debe ser una cadena de texto.",
            "string.pattern.base": "El RUT debe tener el formato correcto (ej: 12345678-9)."
        }),
    email_contacto: Joi.string()
        .email()
        .custom(domainEmailValidator)
        .optional()
        .messages({
            "string.email": "El email debe tener un formato válido."
        }),
    telefono_contacto: Joi.string()
        .pattern(/^\d+$/)
        .max(8)
        .required()
        .messages({
            "string.base": "El teléfono de contacto debe ser una cadena de texto.",
            "string.pattern.base": "El teléfono de contacto solo puede contener números sin espacios.",
            "string.max": "El teléfono de contacto no puede exceder los 8 caracteres.",
            "any.required": "El teléfono de contacto es obligatorio."
        }),
    mensaje: Joi.string()
        .min(5)
        .max(500)
        .required()
        .messages({
            "string.base": "El mensaje debe ser una cadena de texto.",
            "string.min": "El mensaje debe tener al menos 5 caracteres.",
            "string.max": "El mensaje no puede exceder los 500 caracteres.",
            "any.required": "El mensaje es obligatorio."
        }),
    estado: Joi.string()
        .valid("Solicitud Recibida", "En Proceso", "Lista para retirar")
        .optional()
        .messages({
            "string.base": "El estado debe ser una cadena de texto.",
            "any.only": "El estado debe ser uno de: 'Solicitud Recibida', 'En Proceso', 'Lista para retirar'."
        })
});