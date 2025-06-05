"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
  const allowedDomains = ["@gmail.com", "@hotmail.com", "@outlook.com", "@yahoo.com", "@gmail.cl"];
  
  if (!allowedDomains.some(domain => value.endsWith(domain))) {
    return helper.message(`El email electrónico debe finalizar en uno de los siguientes dominios: ${allowedDomains.join(", ")}.`);
  }
  
  return value;
};

export const userQueryValidation = Joi.object({
  id_usuario: Joi.number().integer().positive().messages({
    "number.base": "El ID debe ser un número.",
  }),
  rut: Joi.string()
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.pattern.base": "Formato RUT inválido.",
    }),
  email: Joi.string().email().custom(domainEmailValidator),
}).or("id_usuario", "rut", "email").messages({
  "object.missing": "Debes proporcionar al menos un parámetro: id_usuario, rut o email.",
});
export const userBodyValidation = Joi.object({
  nombre: Joi.string()
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    }),
  apellidos: Joi.string()
    .max(100)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.pattern.base": "Los apellidos solo pueden contener letras y espacios.",
    }),
  email: Joi.string().email().custom(domainEmailValidator),
  rut: Joi.string()
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/),
  password: Joi.string().min(8).max(26).pattern(/^[a-zA-Z0-9]+$/),
  newPassword: Joi.string().min(8).max(26).pattern(/^[a-zA-Z0-9]+$/),
  rol: Joi.string().valid("Cliente", "Empleado", "Administrador"),
  flag_blacklist: Joi.boolean(),
}).or("nombre", "apellidos", "email", "rut", "password", "newPassword", "rol", "flag_blacklist")
  .messages({
    "object.missing": "Debes enviar al menos un campo para actualizar.",
  });
