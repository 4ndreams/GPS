"use strict";
import {
  getProductosDestacadosService,
  addProductoDestacadoService,
  removeProductoDestacadoService,
} from "../services/producto_destacado.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function getProductosDestacadosController(req, res) {
  try {
    const [destacados, error] = await getProductosDestacadosService();
    if (error) return handleErrorClient(res, 404, error);
    return handleSuccess(res, 200, "Productos destacados obtenidos", destacados);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function addProductoDestacadoController(req, res) {
  try {
    const { id_producto, orden } = req.body;
    if (!id_producto) return handleErrorClient(res, 400, "id_producto es requerido");
    const [nuevo, error] = await addProductoDestacadoService(id_producto, orden);
    if (error) return handleErrorClient(res, 404, error);
    return handleSuccess(res, 201, "Producto destacado agregado", nuevo);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function removeProductoDestacadoController(req, res) {
  try {
    const { id } = req.params;
    // id es el id_producto
    const [eliminado, error] = await removeProductoDestacadoService(Number(id));
    if (error) return handleErrorClient(res, 404, error);
    return handleSuccess(res, 200, "Producto destacado eliminado", eliminado);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}
