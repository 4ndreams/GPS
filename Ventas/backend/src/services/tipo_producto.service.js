"use strict";
import TipoProducto from "../entity/tipo_producto.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getTiposProductoService() {
  try {
    const repository = AppDataSource.getRepository(TipoProducto);
    const tipos = await repository.find();
    if (!tipos.length) return [null, "No hay tipos de producto"];
    return [tipos, null];
  } catch (error) {
    console.error("Error al obtener tipos de producto:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createTipoProductoService(body) {
  try {
    const repository = AppDataSource.getRepository(TipoProducto);
    const tipoNuevo = repository.create({
      nombre_tipo: body.nombre_tipo,
    });
    await repository.save(tipoNuevo);
    return [tipoNuevo, null];
  } catch (error) {
    console.error("Error al crear tipo de producto:", error);
    return [null, "Error interno del servidor"];
  }
}
