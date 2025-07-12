"use strict";
import Bodega from "../entity/bodega.entity.js";
import Producto from "../entity/producto.entity.js";
import Material from "../entity/material.entity.js";
import Relleno from "../entity/relleno.entity.js";
import { createProductoService, updateProductoService } from "../services/producto.service.js";
import { AppDataSource } from "../config/configDb.js";
import { updateBodegaService } from "../services/bodega.service.js";

export async function añadir_puertas(body) {
    try{
        const repoBodega = AppDataSource.getRepository(Bodega);
        const repoProducto = AppDataSource.getRepository(Producto);
        let productoExistente = await repoProducto.findOne({
            where: { nombre_producto: body.nombre_producto },relations: ["material", "relleno"]
        });
        if (productoExistente){
            const materialExistente = productoExistente.material;
            const rellenoExistente = productoExistente.relleno;
            console.log("Producto existente:", productoExistente);
            console.log("Material del producto existente:", materialExistente);
            console.log("Relleno del producto existente:", rellenoExistente);
            const BodegaMaterial = await repoBodega.findOne({
                where: {material: materialExistente},
                relations: ["material", "relleno", "producto"]
            });
            console.log("Bodega del material existente:", BodegaMaterial);
            const disminuirStockMaterial = {
                stock: BodegaMaterial.stock - body.stock,
                updatedAt: new Date()
            };
            if(disminuirStockMaterial.stock < 0) {
                return [null, "No hay suficiente stock de material para completar la operación"];
            }
            const material_disminuido = await updateBodegaService(BodegaMaterial.id_bodega, disminuirStockMaterial);
            const bodegaRelleno = await repoBodega.findOne({
                where: {
                relleno: { id_relleno: rellenoExistente.id_relleno }
                },
                relations: ["material", "relleno", "producto"]
                });
            console.log("Bodega del relleno existente:", bodegaRelleno);
            const disminuirStockRelleno = {
                stock: bodegaRelleno.stock - body.stock,
                updatedAt: new Date()
            };
            if(disminuirStockRelleno.stock < 0) {
                return [null, "No hay suficiente stock de relleno para completar la operación"];
            }
            const relleno_disminuido = await updateBodegaService(bodegaRelleno.id_bodega, disminuirStockRelleno);
            const bodegaExistente = await repoBodega.findOne({
                where: { producto: productoExistente.id_producto },
                relations: ["material", "relleno", "producto"]
            });
            console.log("Bodega del producto existente:", bodegaExistente);
            const aumentarStock = {
                stock: bodegaExistente.stock + body.stock,
                updatedAt: new Date()
            };
            const producto_aumentado = await updateBodegaService(bodegaExistente.id_bodega, aumentarStock);
            return [{
                mensaje: "Puertas añadidas correctamente",
                tipo: "actualizacion",
                material_disminuido: material_disminuido,
                relleno_disminuido: relleno_disminuido,
                producto_aumentado: producto_aumentado
            }, null];
        
        }
    }catch (error) {
        console.error("Error al añadir puertas:", error);
        return [null, "Error interno del servidor"];
    }
}