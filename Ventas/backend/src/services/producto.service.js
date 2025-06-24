"use strict";
import Producto from "../entity/producto.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getProductosService() {
  try {
    const repository = AppDataSource.getRepository(Producto);
    const productos = await repository.find();
    return [productos, null];
  } catch (error) {
    return [null, "Error al obtener productos"];
  }
}

export async function getProductoByIdService(id_producto) {
  try {
    const repository = AppDataSource.getRepository(Producto);
    const producto = await repository.findOneBy({ id_producto });
    return producto ? [producto, null] : [null, "Producto no encontrado"];
  } catch (error) {
    return [null, "Error al buscar producto"];
  }
}

export async function createProductoService(body) {
  try {
    const repository = AppDataSource.getRepository(Producto);
    const nuevo = repository.create(body);
    await repository.save(nuevo);
    return [nuevo, null];
  } catch (error) {
    return [null, "Error al crear producto"];
  }
}

export async function updateProductoService(id_producto, body) {
  try {
    const repository = AppDataSource.getRepository(Producto);
    await repository.update({ id_producto }, body);
    const updated = await repository.findOneBy({ id_producto });
    return updated ? [updated, null] : [null, "Producto no encontrado"];
  } catch (error) {
    return [null, "Error al actualizar producto"];
  }
}

export async function deleteProductoService(id_producto) {
  try {
    const repository = AppDataSource.getRepository(Producto);
    const encontrado = await repository.findOneBy({ id_producto });
    if (!encontrado) return [null, "Producto no encontrado"];
    await repository.remove(encontrado);
    return [encontrado, null];
  } catch (error) {
    return [null, "Error al eliminar producto"];
  }
}
