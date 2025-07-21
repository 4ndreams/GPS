"use strict";
import Orden from "../entity/orden.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createDespachoService(despachoData) {
  try {
    const { ordenesIds, transportista, observaciones } = despachoData;
    const repo = AppDataSource.getRepository(Orden);
    
    // Actualizar todas las órdenes seleccionadas
    const updatedOrders = [];
    
    for (const id_orden of ordenesIds) {
      const orden = await repo.findOneBy({ id_orden });
      
      if (!orden) {
        return [null, `Orden con ID ${id_orden} no encontrada`];
      }
      
      if (orden.estado !== 'Fabricada') {
        return [null, `La orden ${id_orden} debe estar en estado 'Fabricada' para ser despachada`];
      }
      
      // Actualizar la orden a estado "En tránsito"
      await repo.update({ id_orden }, {
        estado: 'En tránsito',
        transportista: transportista,
        observaciones: observaciones,
        fecha_envio: new Date(),
        updatedAt: new Date(),
      });
      
      const ordenActualizada = await repo.findOne({
        where: { id_orden },
        relations: ["producto", "usuario", "bodega"],
      });
      
      updatedOrders.push(ordenActualizada);
    }
    
    const despacho = {
      id: Date.now(), // ID temporal para el despacho
      ordenes: updatedOrders,
      transportista,
      observaciones,
      fecha_creacion: new Date(),
      total_ordenes: updatedOrders.length
    };
    
    return [despacho, null];
  } catch (error) {
    console.error("Error al crear despacho:", error);
    return [null, "Error interno del servidor"];
  }
}
