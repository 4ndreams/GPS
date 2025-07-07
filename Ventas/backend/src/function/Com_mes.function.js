"use strict";
import compras from "../entity/compra.entity.js";
import Bodega from "../entity/bodega.entity.js";
import { AppDataSource } from "../config/configDb.js";



export async function compras_totales_filtradas(body) {
    try {
        let { fecha_inicial, fecha_final, id_bodega , tipo_producto} = body || {};

        const añoActual = new Date().getFullYear();

        const fechaInicio = new Date(fecha_inicial);
        const fechaFin = new Date(fecha_final);
        const hoy = new Date();
        const fechaFinOriginal = new Date(fecha_final);
        fechaFin.setDate(fechaFin.getDate() + 1);
// Eliminar la parte de la hora para comparar solo fechas
    
   

        if (isNaN(fechaInicio) || isNaN(fechaFin)) {
            return [null, "Formato de fecha inválido"];
    }

        if (fechaFin < fechaInicio) {
            return [null, "La fecha final no puede ser anterior a la fecha inicial"];
    }

        if (fechaInicio > hoy || fechaFinOriginal > hoy) {
            return [null, "Las fechas no pueden ser mayores a la fecha actual"];
        }



        const repoCompras = AppDataSource.getRepository(compras);
        const todasLasCompras = await repoCompras.find();

        const comprasPorFecha = todasLasCompras.filter((compra) => {
            const creada = new Date(compra.createdAt);
           
            return creada >= fechaInicio && creada <= fechaFin;
        });
        
        let comprasFinales = [...comprasPorFecha];

       if (tipo_producto) {
    const repoBodega = AppDataSource.getRepository(Bodega);
    const bodegas = await repoBodega.find();

    let bodegasFiltradas = [];

    if (Array.isArray(tipo_producto)) {
        bodegasFiltradas = bodegas.filter(b =>
            tipo_producto.includes(b.tipo_producto)
        );
    } else if (typeof tipo_producto === "string") {
        const tipos = tipo_producto.split(",").map(t => t.trim()).filter(t => t !== "");
        bodegasFiltradas = bodegas.filter(b =>
            tipos.includes(String(b.tipo_producto))
        );
    } else {
        bodegasFiltradas = bodegas.filter(b =>
            b.tipo_producto === tipo_producto
        );
    }

    if (bodegasFiltradas.length > 0) {
        comprasFinales = comprasFinales.filter(compra =>
            bodegasFiltradas.some(bod => bod.id_bodega === compra.id_bodega)
        );
    } else {
        return [null, `No se encontraron bodegas con el tipo de producto: ${tipo_producto}`];
    }
}


        if (id_bodega) {
            if (Array.isArray(id_bodega)) {
                comprasFinales = comprasFinales.filter(compra =>
                    id_bodega.includes(compra.id_bodega)
                );
            } else if (typeof id_bodega === "string") {
                // Por si llega coma separados en string
                const ids = id_bodega.split(",").map(i => Number(i.trim())).filter(i => !isNaN(i));
                comprasFinales = comprasFinales.filter(compra =>
                    ids.includes(compra.id_bodega)
                );
            } else {
                comprasFinales = comprasFinales.filter(compra =>
                    compra.id_bodega === id_bodega
                );
            }
        }

        if (comprasFinales.length === 0) {
            // Comprobamos si hay compras por bodega sin filtrar por fecha
            let comprasPorBodega = todasLasCompras;
            if (id_bodega) {
                if (Array.isArray(id_bodega)) {
                    comprasPorBodega = todasLasCompras.filter(compra =>
                        id_bodega.includes(compra.id_bodega)
                    );
                } else if (typeof id_bodega === "string") {
                    const ids = id_bodega.split(",").map(i => Number(i.trim())).filter(i => !isNaN(i));
                    comprasPorBodega = todasLasCompras.filter(compra =>
                        ids.includes(compra.id_bodega)
                    );
                } else {
                    comprasPorBodega = todasLasCompras.filter(compra =>
                        compra.id_bodega === id_bodega
                    );
                }
            }

            if (comprasPorBodega.length > 0) {
                return [null, `No se encontraron compras en el rango ${fecha_inicial} a ${fecha_final}`];
            }

            if (comprasPorFecha.length > 0) {
                return [null, `No se encontraron compras para la bodega ${id_bodega}`];
            }

            return [null, "No se encontraron compras con los filtros aplicados"];
        }


        const totalCompras = comprasFinales.reduce(
            (total, compra) => Number(total) + Number(compra.costo_compra),
            0
        );
        
        return [{ compras: comprasFinales, total: totalCompras }, null];

    } catch (error) {
        console.error("Error en compras_totales_filtradas:", error);
        return [null, "Error al obtener compras totales filtradas"];
    }
}






