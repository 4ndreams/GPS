"use strict";
import Tipo from "../entity/tipo.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getTiposService() {
  try {
    const repository = AppDataSource.getRepository(Tipo);
    const tipos = await repository.find();
    return [tipos, null];
  } catch (error) {
    return [null, "Error al obtener tipos"];
  }
}

export async function getTipoByIdService(id_tipo) {
  try {
    const repository = AppDataSource.getRepository(Tipo);
    const tipo = await repository.findOneBy({ id_tipo });
    return tipo ? [tipo, null] : [null, "Tipo no encontrado"];
  } catch (error) {
    return [null, "Error al buscar tipo"];
  }
}

export async function createTipoService(body) {
  try {
    const repository = AppDataSource.getRepository(Tipo);
    const nuevo = repository.create(body);
    await repository.save(nuevo);
    return [nuevo, null];
  } catch (error) {
    return [null, "Error al crear tipo"];
  }
}

export async function updateTipoService(id_tipo, body) {
  try {
    const repository = AppDataSource.getRepository(Tipo);
    await repository.update({ id_tipo }, body);
    const updated = await repository.findOneBy({ id_tipo });
    return updated ? [updated, null] : [null, "Tipo no encontrado"];
  } catch (error) {
    return [null, "Error al actualizar tipo"];
  }
}

export async function deleteTipoService(id_tipo) {
  try {
    const repository = AppDataSource.getRepository(Tipo);
    const encontrado = await repository.findOneBy({ id_tipo });
    if (!encontrado) return [null, "Tipo no encontrado"];
    await repository.remove(encontrado);
    return [encontrado, null];
  } catch (error) {
    return [null, "Error al eliminar tipo"];
  }
}
