"use strict";
import Bodega from "../entity/bodega.entity.js";
import Producto from "../entity/producto.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  updateBodegaService,
  createBodegaService
} from "../services/bodega.service.js";

export async function añadir_puertas(body) {
  try {
   
    const repoBodega = AppDataSource.getRepository(Bodega);
    const repoProducto = AppDataSource.getRepository(Producto);

    // Buscar el producto y sus relaciones
    const producto = await repoProducto.findOne({
      where: { nombre_producto: body.nombre_producto },
      relations: ["material", "relleno"]
    });

    if (!producto) {
      return [null, "Producto no existente, debe crear el producto primero"];
    }

    const { material, relleno } = producto;

    if (!material || !relleno) {
      return [null, "El producto no tiene material o relleno asociado"];
    }

    // Buscar bodega del material
    const bodegaMaterial = await repoBodega.findOne({
      where: { material: { id_material: material.id_material } },
      relations: ["material"]
    });

    if (!bodegaMaterial || bodegaMaterial.stock < body.stock) {
      return [null, "No hay suficiente stock de material para completar la operación"];
    }

    // Buscar bodega del relleno
    const bodegaRelleno = await repoBodega.findOne({
      where: { relleno: { id_relleno: relleno.id_relleno } },
      relations: ["relleno"]
    });

    if (!bodegaRelleno || bodegaRelleno.stock < body.stock) {
      return [null, "No hay suficiente stock de relleno para completar la operación"];
    }

    // Buscar si ya existe una bodega para el producto (por ID)
    let bodegaProducto = await repoBodega.findOne({
      where: { producto: { id_producto: producto.id_producto } },
      relations: ["producto"]
    });

    let producto_aumentado = null;

    if (!bodegaProducto) {
      // Crear nueva entrada en bodega para el producto
      producto_aumentado = await createBodegaService({
        producto: producto.id_producto,
        stock: body.stock
      });
    } else {
      // Actualizar stock existente
      const nuevoStock = bodegaProducto.stock + body.stock;
      producto_aumentado = await updateBodegaService(bodegaProducto.id_bodega, {
        stock: nuevoStock,
        updatedAt: new Date()
      });
    }

    // Disminuir stock del material
    const material_disminuido = await updateBodegaService(bodegaMaterial.id_bodega, {
      stock: bodegaMaterial.stock - body.stock,
      updatedAt: new Date()
    });

    // Disminuir stock del relleno
    const relleno_disminuido = await updateBodegaService(bodegaRelleno.id_bodega, {
      stock: bodegaRelleno.stock - body.stock,
      updatedAt: new Date()
    });

    return [{
      mensaje: "Puertas añadidas correctamente",
      tipo: bodegaProducto ? "actualizacion" : "creacion",
      producto_aumentado,
      material_disminuido,
      relleno_disminuido
    }, null];

  } catch (error) {
    console.error("Error al añadir puertas:", error);
    return [null, "Error interno del servidor"];
  }
}
