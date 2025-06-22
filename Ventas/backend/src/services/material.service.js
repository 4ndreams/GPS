"use strict";
import Material from "../entity/material.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getMaterialesService() {
  try {
    const repo = AppDataSource.getRepository(Material);
    const materiales = await repo.find();
    return [materiales, null];
  } catch (error) {
    console.error("Error al obtener materiales:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getMaterialByIdService(id) {
  try {
    const repo = AppDataSource.getRepository(Material);
    const material = await repo.findOneBy({ id_material: id });
    return material ? [material, null] : [null, "Material no encontrado"];
  } catch (error) {
    console.error("Error al obtener el material:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createMaterialService(data) {
  try {
    const repo = AppDataSource.getRepository(Material);
    const nuevo = repo.create({
      nombre_material: data.nombre_material,
      caracteristicas: data.caracteristicas,
    });
    await repo.save(nuevo);
    return [nuevo, null];
  } catch (error) {
    console.error("Error al crear material:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateMaterialService(id, data) {
  try {
    const repo = AppDataSource.getRepository(Material);
    const material = await repo.findOneBy({ id_material: id });
    if (!material) return [null, "Material no encontrado"];

    await repo.update(id, {
      nombre_material: data.nombre_material ?? material.nombre_material,
      caracteristicas: data.caracteristicas ?? material.caracteristicas,
    });

    const actualizado = await repo.findOneBy({ id_material: id });
    return [actualizado, null];
  } catch (error) {
    console.error("Error al actualizar material:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteMaterialService(id) {
  try {
    const repo = AppDataSource.getRepository(Material);
    const material = await repo.findOneBy({ id_material: id });
    if (!material) return [null, "Material no encontrado"];
    await repo.remove(material);
    return [material, null];
  } catch (error) {
    console.error("Error al eliminar material:", error);
    return [null, "Error interno del servidor"];
  }
}
