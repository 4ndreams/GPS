"use strict";
import Compra from "../entity/compra.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getComprasService() {
  try {
    const repo = AppDataSource.getRepository(Compra);
    const data = await repo.find();
    return [data, null];
  } catch (err) {
    return [null, "Error al obtener compras"];
  }
}
export async function getCompraByIdService(id) {
  try {
    const repo = AppDataSource.getRepository(Compra);
    const found = await repo.findOneBy({ id_compra: id });
    if (!found) return [null, "Compra no encontrada"];
    return [found, null];
  } catch (err) {
    return [null, "Error al obtener compra"];
  }
}

export async function createCompraService(body) {
  try {
    console.log("Cuerpo de la compra:", body);
    const repo = AppDataSource.getRepository(Compra);
    const nueva = repo.create({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await repo.save(nueva);
    return [nueva, null];
  } catch (err) {
    return [null, "Error al crear compra"];
  }
}

export async function updateCompraService(id, body) {
  try {
    const repo = AppDataSource.getRepository(Compra);
    await repo.update({ id_compra: id }, body);
    const updated = await repo.findOne({
      where: { id_compra: id },
      relations: ["bodega"] 
    }); 
    return [updated, null];
  } catch (err) {
    return [null, "Error al actualizar compra"];
  }
}

export async function deleteCompraService(id) {
  try {
    const repo = AppDataSource.getRepository(Compra);
    const found = await repo.findOneBy({ id_compra: id });
    if (!found) return [null, "No encontrada"];
    await repo.remove(found);
    return [found, null];
  } catch (err) {
    return [null, "Error al eliminar compra"];
  }
}
