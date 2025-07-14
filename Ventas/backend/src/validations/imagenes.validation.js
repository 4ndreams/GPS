"use strict";
import Joi from "joi";

export const ImagenesQueryValidation = Joi.object({
  id_img: Joi.number().integer().positive().required().messages({
    "number.base": "El ID de la imagen debe ser un número.",
    "number.integer": "El ID de la imagen debe ser un número entero.",
    "number.positive": "El ID de la imagen debe ser un número positivo.",
    "any.required": "El ID de la imagen es obligatorio.",
  }),
});

export const ImagenesBodyValidation = Joi.object({
  ruta_imagen: Joi.string().max(500).required().messages({
    "string.base": "La ruta de la imagen debe ser una cadena de texto.",
    "string.max": "La ruta de la imagen no puede tener más de 500 caracteres.",
    "any.required": "La ruta de la imagen es obligatoria.",
  }),
  id_producto: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del producto debe ser un número.",
    "number.integer": "El ID del producto debe ser un número entero.",
    "number.positive": "El ID del producto debe ser un número positivo.",
    "any.required": "El ID del producto es obligatorio.",
  }),
});

export const ImagenesProductoQueryValidation = Joi.object({
  id_producto: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del producto debe ser un número.",
    "number.integer": "El ID del producto debe ser un número entero.",
    "number.positive": "El ID del producto debe ser un número positivo.",
    "any.required": "El ID del producto es obligatorio.",
  }),
});