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
        const { fecha_inicial, fecha_final, id_bodega } = body;

        if (!fecha_inicial || !fecha_final || !id_bodega) {
            return [null, "Se requieren 'fecha_inicial', 'fecha_final' e 'id_bodega'"];
        }

        const repoCompras = AppDataSource.getRepository(compras);
        
        const comprasTotales = await repoCompras
            .createQueryBuilder("compra")
            .where("compra.createdAt BETWEEN :inicio AND :fin", {
                inicio: new Date(fecha_inicial),
                fin: new Date(fecha_final)
            })
            .andWhere("compra.id_bodega = :idBodega", { idBodega: id_bodega })
            .getMany();

        if (comprasTotales.length === 0) {
            return [null, "No se encontraron compras en el rango de fechas y bodega especificados"];
        }

        const totalCompras = comprasTotales.reduce((total, compra) => Number(total) + Number(compra.costo_compra), 0);
        return [{ compras: comprasTotales, total: totalCompras }, null];

    } catch (error) {
        console.error("Error al obtener compras totales filtradas:", error);
        return [null, "Error al obtener compras totales filtradas"];
    }
}


