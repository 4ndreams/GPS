"use strict";
import compras from "../entity/compra.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function compras_totales(body) {
    try {
        
        const { fecha_inicial, fecha_final } = body;

        if (!fecha_inicial || !fecha_final) {
            return [null, "Se requieren 'fecha_inicial' y 'fecha_final' en formato YYYY-MM-DD"];
        }

        const repoCompras = AppDataSource.getRepository(compras);
        
        const comprasTotales = await repoCompras
            .createQueryBuilder("compra")
            .where("compra.createdAt BETWEEN :inicio AND :fin", {
                inicio: new Date(fecha_inicial),
                fin: new Date(fecha_final)
            })
            .getMany();
        if (comprasTotales.length === 0) {
            return [null, "No se encontraron compras en el rango de fechas especificado"];
        }

        const totalCompras = comprasTotales.reduce((total, compra) => Number(total) + Number(compra.costo_compra), 0);
        return [{ compras: comprasTotales, total: totalCompras }, null];

    } catch (error) {
        console.error("Error al obtener compras totales:", error);
        return [null, "Error al obtener compras totales"];
    }
}

export async function compras_totales_filtradas(body) {
    try {
        let { fecha_inicial, fecha_final, id_bodega } = body || {};

        const añoActual = new Date().getFullYear();

        const fechaInicio = new Date(fecha_inicial);
        const fechaFin = new Date(fecha_final);
        const hoy = new Date();

// Eliminar la parte de la hora para comparar solo fechas
        hoy.setHours(0, 0, 0, 0);
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setHours(0, 0, 0, 0);

        if (isNaN(fechaInicio) || isNaN(fechaFin)) {
            return [null, "Formato de fecha inválido"];
    }

        if (fechaFin < fechaInicio) {
            return [null, "La fecha final no puede ser anterior a la fecha inicial"];
    }

        if (fechaInicio > hoy || fechaFin > hoy) {
            return [null, "Las fechas no pueden ser mayores a la fecha actual"];
        }



        const repoCompras = AppDataSource.getRepository(compras);
        const todasLasCompras = await repoCompras.find();

        const comprasPorFecha = todasLasCompras.filter((compra) => {
            const creada = new Date(compra.createdAt);
            return creada >= fechaInicio && creada <= fechaFin;
        });

        let comprasFinales = [...comprasPorFecha];

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






