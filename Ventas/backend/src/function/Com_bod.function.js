"use strict";
import Compra from "../entity/compra.entity.js";
import Bodega from "../entity/bodega.entity.js";
import Material from "../entity/material.entity.js";
import Relleno from "../entity/relleno.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createBodegaService, updateBodegaService } from "../services/bodega.service.js";
import { createMaterialService } from "../services/material.service.js";
import { createRellenoService } from "../services/relleno.service.js";
import { createCompraService } from "../services/compra.service.js";

export async function crearCompXBod(body) {
    try {
        const repoBodega = AppDataSource.getRepository(Bodega);
        const repoMaterial = AppDataSource.getRepository(Material);
        const repoRelleno = AppDataSource.getRepository(Relleno);
        
        let productoExistente = await repoMaterial.findOne({
            where: { nombre_material: body.nombre_producto }
        });
        let rellenoExistente = await repoRelleno.findOne({
            where: { nombre_relleno: body.nombre_producto }
        });
        if(!productoExistente){
            if(rellenoExistente){
                productoExistente = rellenoExistente;
            }                
        }
        console.log("Producto existente:", productoExistente);
        if (productoExistente) {
            // actualizar bodega
            if("id_material" in productoExistente){
                productoExistente = await repoBodega.findOne({
                    where: { material: productoExistente }
                });
            } else if("id_relleno" in productoExistente){
                productoExistente = await repoBodega.findOne({
                    where: { relleno: { id_relleno: productoExistente.id_relleno } }
                });
                
            }
            console.log("Bodega del producto existente:", productoExistente);
            const aumentar = {
                stock: productoExistente.stock + body.stock,
                updatedAt: new Date()
            };

            const bodega_update = await updateBodegaService(productoExistente.id_bodega, aumentar);

            // registrar compra
            body.id_bodega = productoExistente.id_bodega;
            const nuevaCompra = await createCompraService(body);

            return [{
                mensaje: "Producto ya existe, se actualizó el stock y se registró la compra",
                tipo: "actualizacion",
                bodega_actualizada: bodega_update,
                compra_registrada: nuevaCompra
            }, null];
        } else {
            console.log("Producto no existe, creando nuevo producto y bodega");
            // crear nueva bodega
            let nuevoMaterial= null;
            let nuevoRelleno = null;
            let mostrarBodega = null;
            let nuevaCompra = null; 
            if (body.tipo == "material") {
                const bodyMaterial = {
                nombre_material: body.nombre_producto,
            };

            const [nuevoMaterial,errorMaterial] = await createMaterialService(bodyMaterial);
            
            console.log("Nuevo material creado:", nuevoMaterial);
            const[nuevaBodega,errorBodega] = await createBodegaService({
                material: nuevoMaterial, // o Relleno: nuevoRelleno
                stock: body.stock,
            });
            console.log("nueva bodega:", nuevaBodega);
            mostrarBodega = nuevaBodega;
            nuevaCompra = await createCompraService({
                nombre_producto: body.nombre_producto,
                stock: body.stock,
                costo_compra: body.costo_compra,
                id_bodega: nuevaBodega.id_bodega,
            });
            console.log("Nueva compra registrada:", nuevaCompra);

            }else if(body.tipo=="relleno"){
                const bodyRelleno = {
                nombre_relleno: body.nombre_producto,
            };
                const[nuevoRelleno,errorRelleno] = await createRellenoService(bodyRelleno);
                body.id_relleno = nuevoRelleno.id_relleno;
                const[nuevaBodega,errorBodega] = await createBodegaService({
                relleno: nuevoRelleno, 
                stock: body.stock,
            });
            console.log("nueva bodega:", nuevaBodega);
            mostrarBodega = nuevaBodega;
            
                nuevaCompra = await createCompraService({
                nombre_producto: body.nombre_producto,
                stock: body.stock,
                costo_compra: body.costo_compra,
                id_bodega: nuevaBodega.id_bodega,
            });
                console.log("Nueva bodega creada:", nuevaBodega);
            }else if(body.tipo != "material" && body.tipo != "relleno"){
                return [null, "El tipo de la compra debe ser 'material' o 'relleno' para crear la compra en bodega",];
            }else{
                return [null, "Debe especificar un material o un relleno para crear el producto"];
            }

            return [{
                mensaje: "Producto nuevo creado y compra registrada",
                tipo: "creacion",
                almacenar_bodega: mostrarBodega,
                compra_registrada: nuevaCompra
            }, null];
        }
    } catch (error) {
        console.error(error);
        return [null, "Error al crear o registrar compra"];
    }
}

