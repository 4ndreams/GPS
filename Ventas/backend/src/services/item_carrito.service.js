"use strict";
import ItemCarrito from "../entity/item_carrito.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getItemsCarritoService() {
  try {
    const repo = AppDataSource.getRepository(ItemCarrito);
    const items = await repo.find({ relations: ["producto", "venta"] });
    return [items, null];
  } catch (error) {
    console.error("Error al obtener ítems del carrito:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getItemCarritoByIdService(id) {
  try {
    const repo = AppDataSource.getRepository(ItemCarrito);
    const item = await repo.findOne({
      where: { id_item_carrito: id },
      relations: ["producto", "venta"],
    });
    return item ? [item, null] : [null, "Ítem no encontrado"];
  } catch (error) {
    console.error("Error al obtener ítem del carrito:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createItemCarritoService(data) {
  try {
    const repo = AppDataSource.getRepository(ItemCarrito);
    const nuevo = repo.create({
      cantidad: data.cantidad,
      precio: data.precio,
      producto: { id_producto: data.id_producto },
      venta: { id_venta: data.id_venta },
    });
    await repo.save(nuevo);
    return [nuevo, null];
  } catch (error) {
    console.error("Error al crear ítem del carrito:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateItemCarritoService(id, data) {
  try {
    const repo = AppDataSource.getRepository(ItemCarrito);
    const item = await repo.findOneBy({ id_item_carrito: id });
    if (!item) return [null, "Ítem no encontrado"];

    await repo.update(id, {
      cantidad: data.cantidad ?? item.cantidad,
      precio: data.precio ?? item.precio,
    });

    const actualizado = await repo.findOneBy({ id_item_carrito: id });
    return [actualizado, null];
  } catch (error) {
    console.error("Error al actualizar ítem del carrito:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteItemCarritoService(id) {
  try {
    const repo = AppDataSource.getRepository(ItemCarrito);
    const item = await repo.findOneBy({ id_item_carrito: id });
    if (!item) return [null, "Ítem no encontrado"];
    await repo.remove(item);
    return [item, null];
  } catch (error) {
    console.error("Error al eliminar ítem del carrito:", error);
    return [null, "Error interno del servidor"];
  }
}
