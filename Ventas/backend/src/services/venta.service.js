"use strict";
import Venta from "../entity/venta.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getVentasService() {
  try {
    const repository = AppDataSource.getRepository(Venta);
    const ventas = await repository.find();
    return [ventas, null];
  } catch (error) {
    return [null, "Error al obtener ventas"];
  }
}

export async function getVentaByIdService(id_venta) {
  try {
    const repository = AppDataSource.getRepository(Venta);
    const venta = await repository.findOneBy({ id_venta });
    return venta ? [venta, null] : [null, "Venta no encontrada"];
  } catch (error) {
    return [null, "Error al buscar venta"];
  }
}

export async function createVentaService(body) {
  try {
    const repository = AppDataSource.getRepository(Venta);
    const nueva = repository.create(body);
    await repository.save(nueva);
    return [nueva, null];
  } catch (error) {
    return [null, "Error al crear venta"];
  }
}

export async function updateVentaService(id_venta, body) {
  try {
    const repository = AppDataSource.getRepository(Venta);
    await repository.update({ id_venta }, body);
    const updated = await repository.findOneBy({ id_venta });
    return updated ? [updated, null] : [null, "Venta no encontrada"];
  } catch (error) {
    return [null, "Error al actualizar venta"];
  }
}

export async function deleteVentaService(id_venta) {
  try {
    const repository = AppDataSource.getRepository(Venta);
    const encontrada = await repository.findOneBy({ id_venta });
    if (!encontrada) return [null, "Venta no encontrada"];
    await repository.remove(encontrada);
    return [encontrada, null];
  } catch (error) {
    return [null, "Error al eliminar venta"];
  }
}
