"use strict";
import Orden from "../entity/orden.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getOrdenesService() {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const ordenes = await repo.find({ relations: ["producto", "usuario", "bodega"] });
    return [ordenes, null];
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getOrdenByIdService(id) {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const orden = await repo.findOne({ where: { id_orden: id }, relations: ["producto", "usuario", "bodega"] });

    if (!orden) return [null, "Orden no encontrada"];
    return [orden, null];
  } catch (error) {
    console.error("Error al buscar orden:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createOrdenService(body) {
  try {
    const repo = AppDataSource.getRepository(Orden);
    
    // Obtener el producto para calcular el total
    const productoRepo = AppDataSource.getRepository("Producto");
    const producto = await productoRepo.findOne({ where: { id_producto: body.id_producto } });
    
    if (!producto) {
      return [null, "Producto no encontrado"];
    }
    
    // Calcular el total: precio del producto * cantidad
    const total = parseFloat(producto.precio) * parseInt(body.cantidad);
    
    const nuevaOrden = repo.create({
      cantidad: body.cantidad,
      total: total,
      origen: body.origen,
      destino: body.destino,
      fecha_envio: new Date(body.fecha_envio),
      estado: body.estado || "Pendiente",
      prioridad: body.prioridad || "Media",
      transportista: body.transportista || null,
      tipo: body.tipo || "normal",
      observaciones: body.observaciones || null,
      id_producto: body.id_producto,
      id_usuario: body.id_usuario,
      id_bodega: body.id_bodega,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await repo.save(nuevaOrden);
    return [nuevaOrden, null];
  } catch (error) {
    console.error("Error al crear orden:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateOrdenService(id, body) {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const orden = await repo.findOneBy({ id_orden: id });

    if (!orden) return [null, "Orden no encontrada"];

    // Determinar si necesitamos recalcular el total
    const cantidadCambio = body.cantidad !== undefined && body.cantidad !== orden.cantidad;
    const productoCambio = body.id_producto !== undefined && body.id_producto !== orden.id_producto;
    
    let total = orden.total;
    
    // Si cambió la cantidad o el producto, recalcular el total
    if (cantidadCambio || productoCambio) {
      const productoRepo = AppDataSource.getRepository("Producto");
      const idProducto = body.id_producto ?? orden.id_producto;
      const producto = await productoRepo.findOne({ where: { id_producto: idProducto } });
      
      if (!producto) {
        return [null, "Producto no encontrado"];
      }
      
      const nuevaCantidad = body.cantidad ?? orden.cantidad;
      total = parseFloat(producto.precio) * parseInt(nuevaCantidad);
    }

    const updated = {
      cantidad: body.cantidad ?? orden.cantidad,
      total: total,
      origen: body.origen ?? orden.origen,
      destino: body.destino ?? orden.destino,
      fecha_envio: body.fecha_envio ? new Date(body.fecha_envio) : orden.fecha_envio,
      fecha_entrega: body.fecha_entrega ? new Date(body.fecha_entrega) : orden.fecha_entrega,
      estado: body.estado ?? orden.estado,
      prioridad: body.prioridad ?? orden.prioridad,
      transportista: body.transportista ?? orden.transportista,
      tipo: body.tipo ?? orden.tipo,
      observaciones: body.observaciones ?? orden.observaciones,
      id_producto: body.id_producto ?? orden.id_producto,
      id_usuario: body.id_usuario ?? orden.id_usuario,
      id_bodega: body.id_bodega ?? orden.id_bodega,
      updatedAt: new Date(),
    };

    await repo.update({ id_orden: id }, updated);

    const ordenActualizada = await repo.findOne({
      where: { id_orden: id },
      relations: ["producto", "usuario", "bodega"],
    });

    return [ordenActualizada, null];
  } catch (error) {
    console.error("Error al actualizar orden:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getOrdenesByFiltersService(filters) {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const queryBuilder = repo.createQueryBuilder('orden')
      .leftJoinAndSelect('orden.producto', 'producto')
      .leftJoinAndSelect('orden.usuario', 'usuario')
      .leftJoinAndSelect('orden.bodega', 'bodega');
    
    if (filters.estado) {
      // Manejar múltiples estados separados por coma
      const estados = filters.estado.split(',').map(e => e.trim());
      queryBuilder.andWhere('orden.estado IN (:...estados)', { estados });
    }
    
    if (filters.tipo) {
      queryBuilder.andWhere('orden.tipo = :tipo', { tipo: filters.tipo });
    }
    
    const ordenes = await queryBuilder.getMany();
    return [ordenes, null];
  } catch (error) {
    console.error("Error al obtener órdenes filtradas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteOrdenService(id) {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const orden = await repo.findOneBy({ id_orden: id });

    if (!orden) return [null, "Orden no encontrada"];

    await repo.remove(orden);
    return [orden, null];
  } catch (error) {
    console.error("Error al eliminar orden:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function recalcularTotalesService() {
  try {
    const repo = AppDataSource.getRepository(Orden);
    
    // Obtener todas las órdenes con total = 0 o "0.00"
    const ordenes = await repo.find({ 
      relations: ["producto"] 
    });
    
    let actualizadas = 0;
    
    for (const orden of ordenes) {
      // Verificar si el total es 0 o "0.00"
      const totalActual = parseFloat(orden.total);
      if (totalActual === 0 && orden.producto && orden.producto.precio) {
        const total = parseFloat(orden.producto.precio) * parseInt(orden.cantidad);
        await repo.update({ id_orden: orden.id_orden }, { total: total });
        actualizadas++;
        console.log(`Recalculando orden ${orden.id_orden}: ${orden.producto.precio} * ${orden.cantidad} = ${total}`);
      }
    }
    
    return [actualizadas, null];
  } catch (error) {
    console.error("Error al recalcular totales:", error);
    return [null, "Error interno del servidor"];
  }
}

// Marcar orden como completada
export async function marcarOrdenCompletadaService(id) {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const orden = await repo.findOneBy({ id_orden: id });

    if (!orden) return [null, "Orden no encontrada"];

    // Actualizar el estado a "Recibido"
    await repo.update({ id_orden: id }, { 
      estado: "Recibido",
      updatedAt: new Date()
    });

    const ordenActualizada = await repo.findOne({
      where: { id_orden: id },
      relations: ["producto", "usuario", "bodega"],
    });

    return [ordenActualizada, null];
  } catch (error) {
    console.error("Error al marcar orden como completada:", error);
    return [null, "Error interno del servidor"];
  }
}

// Cancelar orden
export async function cancelarOrdenService(id) {
  try {
    const repo = AppDataSource.getRepository(Orden);
    const orden = await repo.findOneBy({ id_orden: id });

    if (!orden) return [null, "Orden no encontrada"];

    // Actualizar el estado a "Cancelado"
    await repo.update({ id_orden: id }, { 
      estado: "Cancelado",
      updatedAt: new Date()
    });

    const ordenActualizada = await repo.findOne({
      where: { id_orden: id },
      relations: ["producto", "usuario", "bodega"],
    });

    return [ordenActualizada, null];
  } catch (error) {
    console.error("Error al cancelar orden:", error);
    return [null, "Error interno del servidor"];
  }
}
