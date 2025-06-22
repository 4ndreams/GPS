"use strict";
import Empleado from "../entity/empleado.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getEmpleadosService() {
  try {
    const repository = AppDataSource.getRepository(Empleado);
    const empleados = await repository.find();
    return [empleados, null];
  } catch (error) {
    return [null, "Error al obtener empleados"];
  }
}

export async function getEmpleadoByIdService(id_empleado) {
  try {
    const repository = AppDataSource.getRepository(Empleado);
    const empleado = await repository.findOneBy({ id_empleado });
    return empleado ? [empleado, null] : [null, "Empleado no encontrado"];
  } catch (error) {
    return [null, "Error al buscar empleado"];
  }
}

export async function createEmpleadoService(body) {
  try {
    const repository = AppDataSource.getRepository(Empleado);
    const nuevo = repository.create(body);
    await repository.save(nuevo);
    return [nuevo, null];
  } catch (error) {
    return [null, "Error al crear empleado"];
  }
}

export async function updateEmpleadoService(id_empleado, body) {
  try {
    const repository = AppDataSource.getRepository(Empleado);
    await repository.update({ id_empleado }, body);
    const updated = await repository.findOneBy({ id_empleado });
    return updated ? [updated, null] : [null, "Empleado no encontrado"];
  } catch (error) {
    return [null, "Error al actualizar empleado"];
  }
}

export async function deleteEmpleadoService(id_empleado) {
  try {
    const repository = AppDataSource.getRepository(Empleado);
    const encontrado = await repository.findOneBy({ id_empleado });
    if (!encontrado) return [null, "Empleado no encontrado"];
    await repository.remove(encontrado);
    return [encontrado, null];
  } catch (error) {
    return [null, "Error al eliminar empleado"];
  }
}
