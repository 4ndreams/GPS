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


