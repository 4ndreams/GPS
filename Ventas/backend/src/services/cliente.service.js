"use strict";
import Cliente from "../entity/cliente.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getClientesService() {
  try {
    const repo = AppDataSource.getRepository(Cliente);
    const clientes = await repo.find();
    return [clientes, null];
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getClienteService(query) {
  try {
    const { id } = query;
    const repo = AppDataSource.getRepository(Cliente);
    const cliente = await repo.findOne({ where: { id } });
    if (!cliente) return [null, "Cliente no encontrado"];
    return [cliente, null];
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createClienteService(body) {
  try {
    const repo = AppDataSource.getRepository(Cliente);
    const nuevo = repo.create({ ...body, createdAt: new Date(), updatedAt: new Date() });
    await repo.save(nuevo);
    return [nuevo, null];
  } catch (error) {
    console.error("Error al crear cliente:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateClienteService(id, body) {
  try {
    const repo = AppDataSource.getRepository(Cliente);
    const encontrado = await repo.findOne({ where: { id } });
    if (!encontrado) return [null, "Cliente no encontrado"];
    await repo.update(id, { ...body, updatedAt: new Date() });
    const actualizado = await repo.findOne({ where: { id } });
    return [actualizado, null];
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteClienteService(id) {
  try {
    const repo = AppDataSource.getRepository(Cliente);
    const cliente = await repo.findOne({ where: { id } });
    if (!cliente) return [null, "Cliente no encontrado"];
    const eliminado = await repo.remove(cliente);
    return [eliminado, null];
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    return [null, "Error interno del servidor"];
  }
}
