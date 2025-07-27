"use strict";
import { AppDataSource } from "../config/configDb.js";
import ProductoDestacado from "../entity/producto_destacado.entity.js";

export async function getProductosDestacadosService() {
  try {
    const repo = AppDataSource.getRepository(ProductoDestacado);
    const destacados = await repo.find({ order: { orden: "ASC" }, relations: ["producto", "producto.tipo"] });
    return [destacados, null];
  } catch (error) {
    return [null, "Error al obtener productos destacados"];
  }
}

export async function addProductoDestacadoService(id_producto, orden = 0) {
  try {
    const repo = AppDataSource.getRepository(ProductoDestacado);
    const productoRepo = AppDataSource.getRepository("Producto");
    const producto = await productoRepo.findOneBy({ id_producto });
    if (!producto) return [null, "Producto no encontrado"];
    // Verificar si ya existe
    const yaExiste = await repo.findOne({ where: { producto: { id_producto } } });
    if (yaExiste) return [null, "El producto ya está en destacados"];
    // Calcular el siguiente orden automáticamente
    const maxOrden = await repo
      .createQueryBuilder("destacado")
      .select("MAX(destacado.orden)", "max")
      .getRawOne();
    const nextOrden = (maxOrden?.max ?? 0) + 1;
    const nuevo = repo.create({ producto, orden: nextOrden });
    await repo.save(nuevo);
    return [nuevo, null];
  } catch (error) {
    return [null, "Error al agregar producto destacado"];
  }
}

export async function removeProductoDestacadoService(id_destacado) {
  try {
    const repo = AppDataSource.getRepository(ProductoDestacado);
    // Buscar el producto destacado por id_destacado
    const destacado = await repo.findOneBy({ id_destacado });
    if (!destacado) return [null, "Producto destacado no encontrado"];
    await repo.remove(destacado);
    return [destacado, null];
  } catch (error) {
    return [null, "Error al eliminar producto destacado"];
  }
}
