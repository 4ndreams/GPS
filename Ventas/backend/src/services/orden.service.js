"use strict";
import Orden from "../entity/orden.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getOrdenesService() {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const ordenes = await repo.find({ relations: ["producto", "usuario"] });
    return [ordenes, null];
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getOrdenByIdService(id) {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const orden = await repo.findOne({ where: { id_orden: id }, relations: ["producto", "usuario"] });

    if (!orden) return [null, "Orden no encontrada"];
    return [orden, null];
  } catch (error) {
    console.error("Error al buscar orden:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createOrdenService(body) {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const nuevaOrden = repo.create({
      cantidad: body.cantidad,
      origen: body.origen,
      destino: body.destino,
      fecha_envio: new Date(body.fecha_envio),
      estado: body.estado || "Pendiente",
      id_producto: body.id_producto,
      id_usuario: body.id_usuario,
      id_bodega: body.id_bodega,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await repo.save(nuevaOrden);
    return [nuevaOrden, null];
  } catch (error) {
    console.error("Error al crear orden:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateOrdenService(id, body) {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const orden = await repo.findOneBy({ id_orden: id });

    if (!orden) return [null, "Orden no encontrada"];

    const updated = {
      cantidad: body.cantidad ?? orden.cantidad,
      origen: body.origen ?? orden.origen,
      destino: body.destino ?? orden.destino,
      fecha_envio: body.fecha_envio ? new Date(body.fecha_envio) : orden.fecha_envio,
      estado: body.estado ?? orden.estado,
      id_producto: body.id_producto ?? orden.id_producto,
      id_usuario: body.id_usuario ?? orden.id_usuario,
      id_bodega: body.id_bodega ?? orden.id_bodega,
      updatedAt: new Date(),
    };

    await repo.update({ id_orden: id }, updated);

    const ordenActualizada = await repo.findOne({
      where: { id_orden: id },
      relations: ["producto", "usuario"],
    });

    return [ordenActualizada, null];
  } catch (error) {
    console.error("Error al actualizar orden:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteOrdenService(id) {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const orden = await repo.findOneBy({ id_orden: id });

    if (!orden) return [null, "Orden no encontrada"];

    await repo.remove(orden);
    return [orden, null];
  } catch (error) {
    console.error("Error al eliminar orden:", error);
    return [null, "Error interno del servidor"];
  }
}
