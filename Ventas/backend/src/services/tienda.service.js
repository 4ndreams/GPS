"use strict";
import Tienda from "../entity/tienda.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getTiendasService() {
  try {
    const tiendaRepository = AppDataSource.getRepository(Tienda);
    const tiendas = await tiendaRepository.find();
    return tiendas;
  } catch (error) {
    console.error("Error al obtener las tiendas:", error);
    return null;
  }
}

export async function getTiendaByIdService(id) {
  try {
    const tiendaRepository = AppDataSource.getRepository(Tienda);
    const tienda = await tiendaRepository.findOne({
      where: { id_tienda: id },
    });
    return tienda;
  } catch (error) {
    console.error("Error al obtener la tienda:", error);
    return null;
  }
}

export async function createTiendaService(data) {
  try {
    const tiendaRepository = AppDataSource.getRepository(Tienda);
    const newTienda = tiendaRepository.create(data);
    const savedTienda = await tiendaRepository.save(newTienda);
    return savedTienda;
  } catch (error) {
    console.error("Error al crear la tienda:", error);
    return null;
  }
}

export async function updateTiendaService(id, data) {
  try {
    const tiendaRepository = AppDataSource.getRepository(Tienda);
    const tienda = await tiendaRepository.findOne({
      where: { id_tienda: id },
    });
    if (!tienda) return null;

    tiendaRepository.merge(tienda, data);
    const updatedTienda = await tiendaRepository.save(tienda);
    return updatedTienda;
  } catch (error) {
    console.error("Error al actualizar la tienda:", error);
    return null;
  }
}

export async function deleteTiendaService(id) {
  try {
    const tiendaRepository = AppDataSource.getRepository(Tienda);
    const tienda = await tiendaRepository.findOne({
      where: { id_tienda: id },
    });
    if (!tienda) return null;

    await tiendaRepository.remove(tienda);
    return tienda;
  } catch (error) {
    console.error("Error al eliminar la tienda:", error);
    return null;
  }
}