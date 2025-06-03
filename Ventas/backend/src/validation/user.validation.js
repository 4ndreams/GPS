"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
  if (!value.endsWith("@gmail.cl")) {
    return helper.message("El correo electrónico debe finalizar en @gmail.cl.");
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
  correo: Joi.string().email().custom(domainEmailValidator),
}).or("id_usuario", "rut", "correo").messages({
  "object.missing": "Debes proporcionar al menos un parámetro: id_usuario, rut o correo.",
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
  correo: Joi.string().email().custom(domainEmailValidator),
  rut: Joi.string()
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/),
  password: Joi.string().min(8).max(26).pattern(/^[a-zA-Z0-9]+$/),
  newPassword: Joi.string().min(8).max(26).pattern(/^[a-zA-Z0-9]+$/),
  rol: Joi.string().valid("Cliente", "Empleado", "Administrador"),
  flag_blacklist: Joi.boolean(),
}).or("nombre", "apellidos", "correo", "rut", "password", "newPassword", "rol", "flag_blacklist")
  .messages({
    "object.missing": "Debes enviar al menos un campo para actualizar.",
  });
