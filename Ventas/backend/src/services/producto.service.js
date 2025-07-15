"use strict";
import Producto from "../entity/producto.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getProductosService() {
  try {
    const repository = AppDataSource.getRepository(Producto);
    const productos = await repository.find();
    
    if (!productos || productos.length === 0) return [null, "No se encontraron productos"];

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
    

    const Material = await AppDataSource.getRepository("Material");
    const Tipo = await AppDataSource.getRepository("Tipo");
    const Relleno = await AppDataSource.getRepository("Relleno");
  
    const material = await Material.findOneBy({ id_material: body.id_material });
    const tipo = await Tipo.findOneBy({ id_tipo: body.id_tipo });
    const relleno = await Relleno.findOneBy({ id_relleno: body.id_relleno });
      
    const nuevo = repository.create(
      {
        ...body,
        material: material ? { id_material: material.id_material } : null,
        tipo: tipo ? { id_tipo: tipo.id_tipo } : null,
        relleno: relleno ? { id_relleno: relleno.id_relleno } : null,
        createdAt: new Date(), 
        updatedAt: new Date()
      });
    await repository.save(nuevo);
    
const productoCompleto = await repository.findOne({
  where: { id_producto: nuevo.id_producto },
  relations: ["material", "tipo", "relleno"]
});

return [productoCompleto, null];
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
