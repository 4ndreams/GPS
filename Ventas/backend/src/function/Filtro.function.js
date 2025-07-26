"use strict";
import Bodega from "../entity/bodega.entity.js";
import material from "../entity/material.entity.js";
import relleno from "../entity/relleno.entity.js";
import producto from "../entity/producto.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function FiltroCompra(){
    try {

   const repoBodega = AppDataSource.getRepository(Bodega);

   const bodega = await repoBodega.find({
         relations: {
            material: true,
            relleno: true,
            producto: true
         }
    });
    const bodegasConMaterial = bodega.filter(b => b.material !== null);
    const bodegasConRelleno = bodega.filter(b => b.relleno !== null);
    return [{bodegasConMaterial, bodegasConRelleno}, null];
}catch (error) {
        console.error("Error en FiltroCompra:", error);
        return [null, "Error al filtrar las compras"];
    }
}
export async function FiltroVenta(){
    try {
        const repoBodega = AppDataSource.getRepository(Bodega);
        const bodega = await repoBodega.find({
            relations: {
                material: true,
                relleno: true,
                producto: true
            }
        });
        const bodegasConProducto = bodega.filter(b => b.producto !== null);
        return [bodegasConProducto, null];
    } catch (error) {
        console.error("Error en FiltroVenta:", error);
        return [null, "Error al filtrar las ventas"];
    }
}


