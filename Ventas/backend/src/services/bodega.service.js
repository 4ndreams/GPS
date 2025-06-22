"use strict";
import Bodega from "../entity/bodega.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getBodegasService() {
  try {
    const repo = AppDataSource.getRepository(Bodega);
    const bodegas = await repo.find();
    return [bodegas, null];
  } catch (error) {
    console.error("Error al obtener bodegas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getBodegaService(query) {
  try {
    const { id } = query;
    const repo = AppDataSource.getRepository(Bodega);
    const bodega = await repo.findOne({ where: { id } });
    if (!bodega) return [null, "Bodega no encontrada"];
    return [bodega, null];
  } catch (error) {
    console.error("Error al obtener bodega:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createBodegaService(body) {
  try {
    const repo = AppDataSource.getRepository(Bodega);
    const nueva = repo.create({ ...body, createdAt: new Date(), updatedAt: new Date() });
    await repo.save(nueva);
    return [nueva, null];
  } catch (error) {
    console.error("Error al crear bodega:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateBodegaService(id, body) {
  try {
    const repo = AppDataSource.getRepository(Bodega);
    const existente = await repo.findOne({ where: { id } });
    if (!existente) return [null, "Bodega no encontrada"];
    await repo.update(id, { ...body, updatedAt: new Date() });
    const actualizada = await repo.findOne({ where: { id } });
    return [actualizada, null];
  } catch (error) {
    console.error("Error al actualizar bodega:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteBodegaService(id) {
  try {
    const repo = AppDataSource.getRepository(Bodega);
    const bodega = await repo.findOne({ where: { id } });
    if (!bodega) return [null, "Bodega no encontrada"];
    const eliminada = await repo.remove(bodega);
    return [eliminada, null];
  } catch (error) {
    console.error("Error al eliminar bodega:", error);
    return [null, "Error interno del servidor"];
  }
}
