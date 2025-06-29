"use strict";
import Compra from "../entity/compra.entity.js";
import Bodega from "../entity/bodega.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createBodegaService, updateBodegaService } from "../services/bodega.service.js";
import { createCompraService } from "../services/compra.service.js";

export async function crearCompXBod(body) {
    try {
        const repoBodega = AppDataSource.getRepository(Bodega);

        const productoExistente = await repoBodega.findOne({
            where: { nombre_producto: body.nombre_producto }
        });

        if (productoExistente) {
            // actualizar bodega
            const aumentar = {
                stock: productoExistente.stock + body.stock,
                costo_total: Number(productoExistente.costo_total) + Number(body.costo_compra)
            };

            await updateBodegaService(productoExistente.id_bodega, aumentar);

            // registrar compra
            body.id_bodega = productoExistente.id_bodega;
            await createCompraService(body);

            return [null, "Producto ya existe, se actualizó el stock y se registró la compra"];
        } else {
            // crear nueva bodega
            const bodyBodega = {
                nombre_producto: body.nombre_producto,
                stock: body.stock,
                costo_total: body.costo_compra
            };
            await createBodegaService(bodyBodega);
            const nuevaBodega = await repoBodega.findOne({
                where: { nombre_producto: body.nombre_producto }
            });
            body.id_bodega = nuevaBodega.id_bodega;
            // registrar compra con nueva bodega
            body.id_bodega = nuevaBodega.id_bodega;
            await createCompraService(body);

            return [null, "Producto nuevo creado y compra registrada"];
        }
    } catch (error) {
        console.error(error);
        return [null, "Error al crear o registrar compra"];
    }
}
