"use strict";
import Joi from "joi";

export const TiendaQueryValidation = Joi.object({
  id_tienda: Joi.number().integer().positive().required().messages({
    "number.base": "El ID de la tienda debe ser un número.",
    "number.integer": "El ID de la tienda debe ser un número entero.",
    "number.positive": "El ID de la tienda debe ser un número positivo.",
    "any.required": "El ID de la tienda es obligatorio.",
  }),
});

export const TiendaBodyValidation = Joi.object({
  nombre_tienda: Joi.string().max(255).required().messages({
    "string.base": "El nombre de la tienda debe ser una cadena de texto.",
    "string.max": "El nombre de la tienda no puede tener más de 255 caracteres.",
    "any.required": "El nombre de la tienda es obligatorio.",
  }),
  medida_ancho: Joi.number().precision(2).positive().optional().messages({
    "number.base": "La medida de ancho debe ser un número.",
    "number.positive": "La medida de ancho debe ser un número positivo.",
  }),
  medida_espesor: Joi.number().precision(2).positive().optional().messages({
    "number.base": "La medida de espesor debe ser un número.",
    "number.positive": "La medida de espesor debe ser un número positivo.",
  }),
  medida_alto: Joi.number().precision(2).positive().optional().messages({
    "number.base": "La medida de alto debe ser un número.",
    "number.positive": "La medida de alto debe ser un número positivo.",
  }),
  nombre: Joi.string().max(255).required().messages({
    "string.base": "El nombre debe ser una cadena de texto.",
    "string.max": "El nombre no puede tener más de 255 caracteres.",
    "any.required": "El nombre es obligatorio.",
  }),
  descripcion: Joi.string().optional().messages({
    "string.base": "La descripción debe ser una cadena de texto.",
  }),
});