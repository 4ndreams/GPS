"use strict";
import Joi from "joi";

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
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.empty": "El RUT no puede estar vacío.",
      "string.pattern.base": "Formato RUT inválido.",
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
    .valid("Cliente", "Empleado", "Administrador")
    .default("Cliente")
    .messages({
      "any.only": "El rol debe ser Cliente, Empleado o Administrador.",
    }),

  flag_blacklist: Joi.boolean().optional(),
}).unknown(false);
