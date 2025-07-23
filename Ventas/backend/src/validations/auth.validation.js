"use strict";
import Joi from "joi";
import RutValidator from "./rut.validation.js";

// Configuración global de mensajes en español para Joi
Joi.defaults(schema => schema.options({ messages: {
  'string.base': 'El campo {#label} debe ser un texto válido.',
  'string.empty': 'El campo {#label} no puede estar vacío.',
  'string.min': 'El campo {#label} debe tener al menos {#limit} caracteres.',
  'string.max': 'El campo {#label} debe tener como máximo {#limit} caracteres.',
  'string.email': 'Debe ser un email válido.',
  'string.pattern.base': 'Formato inválido en {#label}.',
  'any.required': 'El campo {#label} es obligatorio.',
}}));

// Valida dominio de email
const domainEmailValidator = (value, helper) => {
  const allowedDomains = ["@gmail.com", "@hotmail.com", "@outlook.com", "@yahoo.com", "@gmail.cl"];
  
  if (!allowedDomains.some(domain => value.endsWith(domain))) {
    return helper.message(`El email electrónico debe finalizar en uno de los siguientes dominios: ${allowedDomains.join(", ")}.`);
  }
  
  return value;
};

export const authValidation = Joi.object({
  email: Joi.string()
    .min(15)
    .max(255)
    .email()
    .required()
    .custom(domainEmailValidator)
    .messages({
      "string.empty": "El email electrónico no puede estar vacío.",
      "any.required": "El email electrónico es obligatorio.",
      "string.email": "Debe ser un email válido.",
    }),

  password: Joi.string()
    .min(8)
    .max(26)
    .pattern(/^[a-zA-Z0-9]+$/)
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "any.required": "La contraseña es obligatoria.",
      "string.pattern.base": "La contraseña solo puede contener letras y números.",
    }),
}).unknown(false);
export const registerValidation = Joi.object({
  nombre: Joi.string()
    .max(100)
    .required()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "any.required": "El nombre es obligatorio.",
      "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    }),

  apellidos: Joi.string()
    .max(100)
    .required()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "Los apellidos no pueden estar vacíos.",
      "any.required": "Los apellidos son obligatorios.",
      "string.pattern.base": "Los apellidos solo pueden contener letras y espacios.",
    }),

  rut: Joi.string()
    .min(9)
    .max(12)
    .required()
    .custom((value, helper) => {
      if (!RutValidator.isValidRut(value)) {
        return helper.message(`RUT inválido: ${value}`);
      }
      // Devuelve el RUT formateado para el frontend
      return RutValidator.formatRut(value);
    })
    .messages({
      "string.empty": "El RUT no puede estar vacío.",
    }),

  email: Joi.string()
    .min(15)
    .max(255)
    .email()
    .required()
    .custom(domainEmailValidator)
    .messages({
      "string.empty": "El email electrónico no puede estar vacío.",
      "any.required": "El email electrónico es obligatorio.",
      "string.email": "Debe ser un email válido.",
    }),

  password: Joi.string()
    .min(8)
    .max(26)
    .pattern(/^[a-zA-Z0-9]+$/)
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "string.pattern.base": "La contraseña solo puede contener letras y números.",
    }),

  rol: Joi.string()
    .valid("cliente", "fabrica", "tienda", "administrador")
    .messages({
      "any.only": "El rol debe ser cliente, fabrica, tienda o administrador.",
    }),

  flag_blacklist: Joi.boolean().optional(),
}).unknown(false);
