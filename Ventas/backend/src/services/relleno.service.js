"use strict";
import Relleno from "../entity/relleno.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getRellenosService() {
  try {
    const repo = AppDataSource.getRepository(Relleno);
    const rellenos = await repo.find();
    return [rellenos, null];
  } catch (error) {
    console.error("Error al obtener rellenos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getRellenoByIdService(id) {
  try {
    const repo = AppDataSource.getRepository(Relleno);
    const relleno = await repo.findOneBy({ id_relleno: id });
    return relleno ? [relleno, null] : [null, "relleno no encontrado"];
  } catch (error) {
    console.error("Error al obtener el relleno:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createRellenoService(data) {
  try {
    const repo = AppDataSource.getRepository(Relleno);
    const nuevo = repo.create({
      nombre_relleno: data.nombre_relleno,
      caracteristicas: data.caracteristicas,
    });
    await repo.save(nuevo);
    return [nuevo, null];
  } catch (error) {
    console.error("Error al crear relleno:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateRellenoService(id, data) {
  try {
    const repo = AppDataSource.getRepository(Relleno);
    const relleno = await repo.findOneBy({ id_relleno: id });
    if (!relleno) return [null, "relleno no encontrado"];

    await repo.update(id, {
      nombre_relleno: data.nombre_relleno ?? relleno.nombre_relleno,
      caracteristicas: data.caracteristicas ?? relleno.caracteristicas,
    });

    const actualizado = await repo.findOneBy({ id_relleno: id });
    return [actualizado, null];
  } catch (error) {
    console.error("Error al actualizar relleno:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteRellenoService(id) {
  try {
    const repo = AppDataSource.getRepository(Relleno);
    const relleno = await repo.findOneBy({ id_relleno: id });
    if (!relleno) return [null, "relleno no encontrado"];
    await repo.remove(relleno);
    return [relleno, null];
  } catch (error) {
    console.error("Error al eliminar relleno:", error);
    return [null, "Error interno del servidor"];
  }
}
