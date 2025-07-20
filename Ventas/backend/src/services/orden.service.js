"use strict";
import Orden from "../entity/orden.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getOrdenesService() {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const ordenes = await repo.find({ relations: ["producto", "usuario", "bodega"] });
    return [ordenes, null];
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getOrdenByIdService(id) {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const orden = await repo.findOne({ where: { id_orden: id }, relations: ["producto", "usuario", "bodega"] });

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
      prioridad: body.prioridad || "Media",
      transportista: body.transportista || null,
      tipo: body.tipo || "normal",
      observaciones: body.observaciones || null,
      foto_despacho: body.foto_despacho || null,
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
      fecha_entrega: body.fecha_entrega ? new Date(body.fecha_entrega) : orden.fecha_entrega,
      estado: body.estado ?? orden.estado,
      prioridad: body.prioridad ?? orden.prioridad,
      transportista: body.transportista ?? orden.transportista,
      tipo: body.tipo ?? orden.tipo,
      observaciones: body.observaciones ?? orden.observaciones,
      foto_despacho: body.foto_despacho ?? orden.foto_despacho,
      id_producto: body.id_producto ?? orden.id_producto,
      id_usuario: body.id_usuario ?? orden.id_usuario,
      id_bodega: body.id_bodega ?? orden.id_bodega,
      updatedAt: new Date(),
    };

    await repo.update({ id_orden: id }, updated);

    const ordenActualizada = await repo.findOne({
      where: { id_orden: id },
      relations: ["producto", "usuario", "bodega"],
    });

    return [ordenActualizada, null];
  } catch (error) {
    console.error("Error al actualizar orden:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getOrdenesByFiltersService(filters) {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const queryBuilder = repo.createQueryBuilder('orden')
      .leftJoinAndSelect('orden.producto', 'producto')
      .leftJoinAndSelect('orden.usuario', 'usuario')
      .leftJoinAndSelect('orden.bodega', 'bodega');
    
    if (filters.estado) {
      // Manejar múltiples estados separados por coma
      const estados = filters.estado.split(',').map(e => e.trim());
      queryBuilder.andWhere('orden.estado IN (:...estados)', { estados });
    }
    
    if (filters.tipo) {
      queryBuilder.andWhere('orden.tipo = :tipo', { tipo: filters.tipo });
    }
    
    const ordenes = await queryBuilder.getMany();
    return [ordenes, null];
  } catch (error) {
    console.error("Error al obtener órdenes filtradas:", error);
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
