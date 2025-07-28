"use strict";
import compras from "../entity/compra.entity.js";
import ventas from "../entity/venta.entity.js";
import Bodega from "../entity/bodega.entity.js";
import { AppDataSource } from "../config/configDb.js";



export async function compras_totales_filtradas(body) {
    try {
        
        let { fecha_inicial, fecha_final, id_bodega ,tipo} = body || {};
        
        const añoActual = new Date().getFullYear();
        const mesActual = new Date().getMonth() + 1;
        const diaActual = new Date().getDate();
        if (!fecha_inicial || !fecha_final) {
            fecha_inicial = `${añoActual}-01-01`;
            fecha_final = `${añoActual}-${mesActual}-${diaActual}`;
        }else if(!fecha_inicial && fecha_final) {
            return [null, "Debe especificar una fecha inicial"];
        }else if(fecha_inicial && !fecha_final) {
            return [null, "Debe especificar una fecha final"];
        }
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
        let todasLasCompras = await repoCompras.find({
            relations: {
            bodega: {
            material: true,
            relleno: true,
            producto: true
            }
        }
        });
        
       if( tipo == "material" ) {
            todasLasCompras = todasLasCompras.filter(compra => compra.bodega.material !== null);
           
        } else if (tipo == "relleno") {
            todasLasCompras = todasLasCompras.filter(compra => compra.bodega.relleno !== null);
        }

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
        const totalCantidades = comprasFinales.reduce(
            (total, compra) => Number(total) + Number(compra.stock),
            0
        );
        
        return [{ compras: comprasFinales, total: totalCompras , cantidad: totalCantidades }, null];

    } catch (error) {
        console.error("Error en compras_totales_filtradas:", error);
        return [null, "Error al obtener compras totales filtradas"];
    }
}
export async function ventasTotalesPorMes (body) {
    try {
        console.log("Cuerpo de la solicitud:", body);
        let { fecha_inicial, fecha_final } = body || {};
        
        const añoActual = new Date().getFullYear();
        const mesActual = new Date().getMonth() + 1;
        const diaActual = new Date().getDate();

        if (!fecha_inicial && !fecha_final) {
            fecha_inicial = `${añoActual}-01-01`;
            fecha_final = `${añoActual}-${mesActual}-${diaActual}`;
        } else if (!fecha_inicial && fecha_final) {
            return [null, "Debe especificar una fecha inicial"];
        } else if (fecha_inicial && !fecha_final) {
            return [null, "Debe especificar una fecha final"];
        }

        const fechaInicio = new Date(fecha_inicial);
        const fechaFin = new Date(fecha_final);
        const hoy = new Date();
        const fechaFinOriginal = new Date(fecha_final);

        fechaFin.setDate(fechaFin.getDate() + 1); // incluir el último día completo

        if (isNaN(fechaInicio) || isNaN(fechaFin)) {
            return [null, "Formato de fecha inválido"];
        }

        if (fechaFin < fechaInicio) {
            return [null, "La fecha final no puede ser anterior a la fecha inicial"];
        }

        if (fechaInicio > hoy || fechaFinOriginal > hoy) {
            return [null, "Las fechas no pueden ser mayores a la fecha actual"];
        }

        const repoVentas = AppDataSource.getRepository(ventas);

        const todasLasVentas = await repoVentas.find({
            relations: { usuario: true }
        });

        const todasLasventasaprovechadas = todasLasVentas.filter(venta => venta.estado_pago === "Pagado");

        const ventasPorMes = todasLasventasaprovechadas.filter(venta => {
            const fechaPago = new Date(venta.fecha_pago);
            return fechaPago >= fechaInicio && fechaPago <= fechaFin;
        });

        if (ventasPorMes.length === 0) {
            return [null, `No se encontraron ventas en el rango ${fecha_inicial} a ${fecha_final}`];
        }

        const totalVentas = ventasPorMes.reduce(
            (total, venta) => total + Number(venta.precio_venta),
            0
        );
        const totalCantidades = ventasPorMes.reduce(
            (total, venta) => total + Number(venta.cantidad),
            0
        );

        return [{ ventas: ventasPorMes, total: totalVentas, cantidad: totalCantidades }, null];

    } catch (error) {
        console.error("Error en ventasTotalesPorMes:", error);
        return [null, "Error al obtener las ventas totales"];
    }
}
