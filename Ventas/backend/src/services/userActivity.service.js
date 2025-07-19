import { AppDataSource } from "../config/configDb.js";
import UsuarioSchema from "../entity/user.entity.js";
import UserEventSchema from "../entity/userEvent.entity.js";
import DetalleVentaSchema from "../entity/detalleVenta.entity.js";

const usuarioRepo = AppDataSource.getRepository(UsuarioSchema);
const userEventRepo = AppDataSource.getRepository(UserEventSchema);
const detalleVentaRepo = AppDataSource.getRepository(DetalleVentaSchema);

export async function getUserActivityService({ id_usuario, query }) {
  const isRegisteredUser = id_usuario !== 'anon' && !isNaN(parseInt(id_usuario));
  const userId = isRegisteredUser ? parseInt(id_usuario) : null;

  let userData = {};
  let userEvents = [];
  let userPurchases = [];

  if (isRegisteredUser) {
    const user = await usuarioRepo.findOne({
      where: { id_usuario: userId },
      select: ["id_usuario", "nombre", "apellidos", "email", "createdAt"]
    });

    if (!user) {
      throw { status: 404, message: "Usuario no encontrado" };
    }

    userData = {
      id_usuario: user.id_usuario,
      nombre_completo: `${user.nombre} ${user.apellidos}`,
      email: user.email,
      fecha_registro: user.createdAt,
    };

    userEvents = await userEventRepo.find({
      where: { usuario: { id_usuario: userId } },
      relations: ["producto"],
      order: { fecha: "DESC" },
    });

    userPurchases = await detalleVentaRepo.createQueryBuilder("detalleVenta")
      .leftJoinAndSelect("detalleVenta.venta", "venta")
      .leftJoinAndSelect("detalleVenta.producto", "producto")
      .where("venta.usuario.id_usuario = :userId", { userId })
      .orderBy("venta.fecha_solicitud", "DESC")
      .getMany();

  } else {
    const { ip, userAgent, startDate, endDate } = query;

    if (!ip && !userAgent) {
      throw { status: 400, message: "Para usuarios anónimos se requiere 'ip' o 'userAgent'." };
    }

    let qb = userEventRepo.createQueryBuilder("event")
      .leftJoinAndSelect("event.producto", "producto")
      .where("event.usuario IS NULL");

    if (ip) qb = qb.andWhere("event.metadata->>'ip' = :ip", { ip });
    if (userAgent) qb = qb.andWhere("event.metadata->>'userAgent' = :userAgent", { userAgent });
    if (startDate) qb = qb.andWhere("event.fecha >= :startDate", { startDate: new Date(startDate) });
    if (endDate) qb = qb.andWhere("event.fecha <= :endDate", { endDate: new Date(endDate) });

    userEvents = await qb.orderBy("event.fecha", "DESC").getMany();
    userData = { status: "Usuario Anónimo", identifier: `IP: ${ip || 'N/A'}, UserAgent: ${userAgent || 'N/A'}` };
  }

  // Procesar eventos
  const visitedProducts = new Map();
  const addedToCartProducts = new Map();
  const purchasedProducts = new Map();

  userEvents.filter(e => e.tipo_evento === "PRODUCT_VIEW").forEach(event => {
    const prod = event.producto;
    if (!prod) return;
    const data = visitedProducts.get(prod.id_producto) || {
      id_producto: prod.id_producto,
      nombre_producto: prod.nombre_producto,
      precio_actual: prod.precio,
      descripcion: prod.descripcion,
      firstView: event.fecha,
      lastView: event.fecha,
      viewCount: 0,
      metadata: event.metadata
    };
    data.lastView = event.fecha;
    data.viewCount += 1;
    visitedProducts.set(prod.id_producto, data);
  });

  userEvents.filter(e => e.tipo_evento === "ADD_TO_CART").forEach(event => {
    const prod = event.producto;
    if (!prod) return;
    const quantity = event.metadata?.quantity || 1;
    const data = addedToCartProducts.get(prod.id_producto) || {
      id_producto: prod.id_producto,
      nombre_producto: prod.nombre_producto,
      precio_actual: prod.precio,
      timestamps: [],
      totalQuantityAdded: 0,
    };
    data.timestamps.push(event.fecha);
    data.totalQuantityAdded += quantity;
    addedToCartProducts.set(prod.id_producto, data);
  });

  userPurchases.forEach(item => {
    const prod = item.producto;
    const venta = item.venta;
    if (!prod || !venta) return;
    purchasedProducts.set(prod.id_producto, {
      id_producto: prod.id_producto,
      nombre_producto: prod.nombre_producto,
      cantidad_comprada: item.cantidad,
      precio_unitario_compra: item.precio_unitario,
      fecha_compra: venta.fecha_solicitud,
      id_venta: venta.id_venta,
      estado_pago_venta: venta.estado_pago,
    });
  });

  const productsViewedButNotBought = [];
  visitedProducts.forEach((data, id) => {
    if (!purchasedProducts.has(id)) {
      productsViewedButNotBought.push({
        ...data,
        addedToCart: addedToCartProducts.has(id),
      });
    }
  });

  const summary = {
    totalViews: Array.from(visitedProducts.values()).reduce((sum, p) => sum + p.viewCount, 0),
    totalAddedToCart: Array.from(addedToCartProducts.values()).reduce((sum, p) => sum + p.totalQuantityAdded, 0),
    totalPurchasedItems: Array.from(purchasedProducts.values()).reduce((sum, p) => sum + p.cantidad_comprada, 0),
    totalSalesValue: userPurchases.reduce((sum, p) => sum + (parseFloat(p.subtotal) || 0), 0),
    uniqueEventTypes: [...new Set(userEvents.map(e => e.tipo_evento))],
    totalEvents: userEvents.length,
    totalSales: userPurchases.length > 0 ? new Set(userPurchases.map(p => p.venta.id_venta)).size : 0,
  };

  return {
    user: userData,
    activity: {
      visitedProducts: Array.from(visitedProducts.values()),
      addedToCartProducts: Array.from(addedToCartProducts.values()),
      purchasedProducts: Array.from(purchasedProducts.values()),
      productsViewedButNotBought,
      summary,
    },
  };
}
