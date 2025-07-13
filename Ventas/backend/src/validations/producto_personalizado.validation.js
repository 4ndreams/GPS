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

// Validador personalizado para medidas según el tipo de puerta
const validateAncho = (ancho, tipoPuerta) => {
  if (tipoPuerta === 'puertaPaso') {
    return ancho >= 60 && ancho <= 90;
  } else if (tipoPuerta === 'puertaCloset') {
    return ancho >= 40 && ancho <= 60;
  }
  return false;
};

const validateAlto = (alto) => {
  return alto >= 200 && alto <= 240;
};

const validateEspesor = (espesor, tipoPuerta) => {
  if (tipoPuerta === 'puertaPaso') {
    return espesor === 45;
  } else if (tipoPuerta === 'puertaCloset') {
    return espesor === 18;
  }
  return false;
};

const medidasValidator = (value, helper) => {
  const { medida_ancho, medida_alto, medida_largo, tipo_puerta } = helper.state.ancestors[0];
  const fieldPath = helper.state.path.join('.');
  
  // Solo validar si tipo_puerta está presente
  if (!tipo_puerta) {
    return value; // No validar si no hay tipo_puerta
  }
  
  // Validar según el campo específico
  if (fieldPath === 'medida_ancho' && medida_ancho && !validateAncho(medida_ancho, tipo_puerta)) {
    const ranges = tipo_puerta === 'puertaPaso' ? '60-90 cm' : '40-60 cm';
    return helper.message(`El ancho para ${tipo_puerta === 'puertaPaso' ? 'puertas de paso' : 'puertas de closet'} debe estar entre ${ranges}.`);
  }
  
  if (fieldPath === 'medida_alto' && medida_alto && !validateAlto(medida_alto)) {
    return helper.message("El alto debe estar entre 200 y 240 cm.");
  }
  
  if (fieldPath === 'medida_largo' && medida_largo && !validateEspesor(medida_largo, tipo_puerta)) {
    const espesorCorrect = tipo_puerta === 'puertaPaso' ? '45mm' : '18mm';
    return helper.message(`El espesor para ${tipo_puerta === 'puertaPaso' ? 'puertas de paso' : 'puertas de closet'} debe ser ${espesorCorrect}.`);
  }
  
  return value;
};

// Validador personalizado para teléfono (exactamente 8 dígitos)
const telefonoValidator = (value, helper) => {
  if (!/^\d{8}$/.test(value)) {
    return helper.message("El teléfono debe tener exactamente 8 dígitos.");
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
    tipo_puerta: Joi.string()
        .valid("puertaPaso", "puertaCloset")
        .required()
        .messages({
            "string.base": "El tipo de puerta debe ser una cadena de texto.",
            "any.only": "El tipo de puerta debe ser 'puertaPaso' o 'puertaCloset'.",
            "any.required": "El tipo de puerta es obligatorio."
        }),
    medida_ancho: Joi.number()
        .precision(2)
        .min(40)
        .max(90)
        .required()
        .custom(medidasValidator)
        .messages({
            "number.base": "El ancho debe ser un número.",
            "number.min": "El ancho debe ser al menos 40 centímetros.",
            "number.max": "El ancho no puede exceder 90 centímetros.",
            "number.precision": "El ancho puede tener máximo 2 decimales.",
            "any.required": "El ancho es obligatorio."
        }),
    medida_alto: Joi.number()
        .precision(2)
        .min(200)
        .max(240)
        .required()
        .custom(medidasValidator)
        .messages({
            "number.base": "El alto debe ser un número.",
            "number.min": "El alto debe ser al menos 200 centímetros.",
            "number.max": "El alto no puede exceder 240 centímetros.",
            "number.precision": "El alto puede tener máximo 2 decimales.",
            "any.required": "El alto es obligatorio."
        }),
    medida_largo: Joi.number()
        .precision(2)
        .valid(18, 45)
        .required()
        .custom(medidasValidator)
        .messages({
            "number.base": "El espesor debe ser un número.",
            "any.only": "El espesor debe ser 18mm o 45mm.",
            "number.precision": "El espesor puede tener máximo 2 decimales.",
            "any.required": "El espesor es obligatorio."
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
        .length(8)
        .custom(telefonoValidator)
        .required()
        .messages({
            "string.base": "El teléfono de contacto debe ser una cadena de texto.",
            "string.length": "El teléfono de contacto debe tener exactamente 8 dígitos.",
            "any.required": "El teléfono de contacto es obligatorio."
        }),
    mensaje: Joi.string()
        .min(0)
        .max(500)
        .optional()
        .messages({
            "string.base": "El mensaje debe ser una cadena de texto.",
            "string.min": "El mensaje debe tener al menos 0 caracteres.",
            "string.max": "El mensaje no puede exceder los 500 caracteres."
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
    tipo_puerta: Joi.string()
        .valid("puertaPaso", "puertaCloset")
        .required()
        .messages({
            "string.base": "El tipo de puerta debe ser una cadena de texto.",
            "any.only": "El tipo de puerta debe ser 'puertaPaso' o 'puertaCloset'.",
            "any.required": "El tipo de puerta es obligatorio."
        }),
    medida_ancho: Joi.number()
        .precision(2)
        .min(40)
        .max(90)
        .required()
        .custom(medidasValidator)
        .messages({
            "number.base": "El ancho debe ser un número.",
            "number.min": "El ancho debe ser al menos 40 centímetros.",
            "number.max": "El ancho no puede exceder 90 centímetros.",
            "number.precision": "El ancho puede tener máximo 2 decimales.",
            "any.required": "El ancho es obligatorio."
        }),
    medida_alto: Joi.number()
        .precision(2)
        .min(200)
        .max(240)
        .required()
        .custom(medidasValidator)
        .messages({
            "number.base": "El alto debe ser un número.",
            "number.min": "El alto debe ser al menos 200 centímetros.",
            "number.max": "El alto no puede exceder 240 centímetros.",
            "number.precision": "El alto puede tener máximo 2 decimales.",
            "any.required": "El alto es obligatorio."
        }),
    medida_largo: Joi.number()
        .precision(2)
        .valid(18, 45)
        .required()
        .custom(medidasValidator)
        .messages({
            "number.base": "El espesor debe ser un número.",
            "any.only": "El espesor debe ser 18mm o 45mm.",
            "number.precision": "El espesor puede tener máximo 2 decimales.",
            "any.required": "El espesor es obligatorio."
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
        .length(8)
        .custom(telefonoValidator)
        .required()
        .messages({
            "string.base": "El teléfono de contacto debe ser una cadena de texto.",
            "string.length": "El teléfono de contacto debe tener exactamente 8 dígitos.",
            "any.required": "El teléfono de contacto es obligatorio."
        }),
    mensaje: Joi.string()
        .min(0)
        .max(500)
        .optional()
        .messages({
            "string.base": "El mensaje debe ser una cadena de texto.",
            "string.min": "El mensaje debe tener al menos 0 caracteres.",
            "string.max": "El mensaje no puede exceder los 500 caracteres."
        }),
    estado: Joi.string()
        .valid("Solicitud Recibida", "En Proceso", "Lista para retirar")
        .optional()
        .messages({
            "string.base": "El estado debe ser una cadena de texto.",
            "any.only": "El estado debe ser uno de: 'Solicitud Recibida', 'En Proceso', 'Lista para retirar'."
        })
});