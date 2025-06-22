"use strict";
import MensajeContacto from "../entity/mensaje_contacto.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getMensajesContactoService() {
  try {
    const repository = AppDataSource.getRepository(MensajeContacto);
    const mensajes = await repository.find();
    return [mensajes, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function getMensajeContactoByIdService(id_mensaje) {
  try {
    const repository = AppDataSource.getRepository(MensajeContacto);
    const mensaje = await repository.findOneBy({ id_mensaje });
    if (!mensaje) return [null, "Mensaje no encontrado"];
    return [mensaje, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function createMensajeContactoService(data) {
  try {
    const repository = AppDataSource.getRepository(MensajeContacto);
    const nuevoMensaje = repository.create(data);
    await repository.save(nuevoMensaje);
    return [nuevoMensaje, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function updateMensajeContactoService(id_mensaje, data) {
  try {
    const repository = AppDataSource.getRepository(MensajeContacto);
    await repository.update({ id_mensaje }, { ...data, updatedAt: new Date() });
    const actualizado = await repository.findOneBy({ id_mensaje });
    return [actualizado, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function deleteMensajeContactoService(id_mensaje) {
  try {
    const repository = AppDataSource.getRepository(MensajeContacto);
    const toRemove = await repository.findOneBy({ id_mensaje });
    if (!toRemove) return [null, "Mensaje no encontrado"];
    await repository.remove(toRemove);
    return [toRemove, null];
  } catch (error) {
    return [null, error.message];
  }
}
