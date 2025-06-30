// src/controllers/user.controller.js
"use strict";
import {
  deleteUserService,
  getUserService,
  getUsersService,
  updateUserService,
  getProfileService,
  updateProfileService,
} from "../services/user.service.js";
import {
  userBodyValidation,
  userQueryValidation,
} from "../validations/user.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

import { AppDataSource } from '../config/configDb.js'; 
import UsuarioSchema from '../entity/user.entity.js'; 
import UserEventSchema from '../entity/userEvent.entity.js'; 
import VentaSchema from '../entity/venta.entity.js'; 
import DetalleVentaSchema from '../entity/detalleVenta.entity.js'; 
import ProductoSchema from '../entity/producto.entity.js'; 

const usuarioRepo = AppDataSource.getRepository(UsuarioSchema);
const userEventRepo = AppDataSource.getRepository(UserEventSchema);
const ventaRepo = AppDataSource.getRepository(VentaSchema);
const detalleVentaRepo = AppDataSource.getRepository(DetalleVentaSchema);


export async function getUser(req, res) {
  try {
    const { rut, id, email } = req.query;

    const { error } = userQueryValidation.validate({ rut, id, email });

    if (error) return handleErrorClient(res, 400, error.message);

    const [user, errorUser] = await getUserService({ rut, id, email });

    if (errorUser) return handleErrorClient(res, 404, errorUser);

    handleSuccess(res, 200, "Usuario encontrado", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getUsers(req, res) {
  try {
    const [users, errorUsers] = await getUsersService();

    if (errorUsers) return handleErrorClient(res, 404, errorUsers);

    users.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Usuarios encontrados", users);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateUser(req, res) {
  try {
    const { rut, id, email } = req.query;
    const { body } = req;

    const { error: queryError } = userQueryValidation.validate({
      rut,
      id,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message
      );
    }

    const { error: bodyError } = userBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message
      );

    const [user, userError] = await updateUserService(
      { rut, id, email },
      body
    );

    if (userError)
      return handleErrorClient(
        res,
        400,
        "Error modificando al usuario",
        userError
      );

    handleSuccess(res, 200, "Usuario modificado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteUser(req, res) {
  try {
    const { rut, id, email } = req.query;

    const { error: queryError } = userQueryValidation.validate({
      rut,
      id,
      email,
    });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message
      );
    }

    const [userDelete, errorUserDelete] = await deleteUserService({
      rut,
      id,
      email,
    });

    if (errorUserDelete)
      return handleErrorClient(
        res,
        404,
        "Error eliminado al usuario",
        errorUserDelete
      );

    handleSuccess(res, 200, "Usuario eliminado correctamente", userDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getProfile(req, res) {
  try {
    // Usa el campo correcto según tu req.user
    const userId = req.user?.id_usuario;

    const [user, errorUser] = await getProfileService(userId);
    if (errorUser) return handleErrorClient(res, 404, errorUser);

    handleSuccess(res, 200, "Perfil de usuario obtenido", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user?.id_usuario;
    const { body } = req;

    // Valida el body si tienes validación
    const { error: bodyError } = userBodyValidation.validate(body);
    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message
      );

    const [user, userError] = await updateProfileService(userId, body);

    if (userError)
      return handleErrorClient(
        res,
        400,
        "Error modificando el perfil",
        userError
      );

    handleSuccess(res, 200, "Perfil modificado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}


export const getUserActivity = async (req, res) => {
    const { id_usuario } = req.params; // Puede ser un ID numérico o 'anon'
    const isRegisteredUser = id_usuario !== 'anon' && !isNaN(parseInt(id_usuario));
    const userId = isRegisteredUser ? parseInt(id_usuario) : null;

    try {
        let userData = {};
        let userEvents = [];
        let userPurchases = [];

        if (isRegisteredUser) {
            const user = await usuarioRepo.findOne({
                where: { id_usuario: userId },
                select: ["id_usuario", "nombre", "apellidos", "email", "createdAt"]
            });

            if (!user) {
                return handleErrorClient(res, 404, "Usuario no encontrado");
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

            // ###############################################################
            // SOLUCIÓN PARA userPurchases: Usar createQueryBuilder
            // ###############################################################
            userPurchases = await detalleVentaRepo.createQueryBuilder("detalleVenta")
                .leftJoinAndSelect("detalleVenta.venta", "venta")      // Unir con la tabla de venta
                .leftJoinAndSelect("detalleVenta.producto", "producto") // Unir con la tabla de producto
                .where("venta.usuario.id_usuario = :userId", { userId: userId }) // Filtrar por el ID del usuario
                .orderBy("venta.fecha_solicitud", "DESC")             // Ordenar por la fecha de la venta
                .getMany();
            // ###############################################################

        } else {
            const { ip, userAgent, startDate, endDate } = req.query;

            if (!ip && !userAgent) {
                return handleErrorClient(res, 400, "Para usuarios anónimos, se requiere 'ip' o 'userAgent' y opcionalmente 'startDate'/'endDate' en los parámetros de consulta.");
            }

            let queryBuilder = userEventRepo.createQueryBuilder("event")
                .leftJoinAndSelect("event.producto", "producto")
                .where("event.usuario IS NULL");

            if (ip) {
                queryBuilder = queryBuilder.andWhere("event.metadata->>'ip' = :ip", { ip });
            }
            if (userAgent) {
                queryBuilder = queryBuilder.andWhere("event.metadata->>'userAgent' = :userAgent", { userAgent });
            }
            if (startDate) {
                queryBuilder = queryBuilder.andWhere("event.fecha >= :startDate", { startDate: new Date(startDate) });
            }
            if (endDate) {
                queryBuilder = queryBuilder.andWhere("event.fecha <= :endDate", { endDate: new Date(endDate) });
            }

            userEvents = await queryBuilder.orderBy("event.fecha", "DESC").getMany();
            userData = { status: "Usuario Anónimo", identifier: `IP: ${ip || 'N/A'}, UserAgent: ${userAgent || 'N/A'}` };
            // Para usuarios anónimos, userPurchases se mantiene vacío, lo cual es correcto según tu lógica actual.
        }

        const visitedProducts = new Map();
        userEvents.filter(e => e.tipo_evento === "PRODUCT_VIEW").forEach(event => {
            if (event.producto) {
                if (!visitedProducts.has(event.producto.id_producto)) {
                    visitedProducts.set(event.producto.id_producto, {
                        id_producto: event.producto.id_producto,
                        nombre_producto: event.producto.nombre_producto,
                        precio_actual: event.producto.precio,
                        descripcion: event.producto.descripcion,
                        firstView: event.fecha,
                        lastView: event.fecha,
                        viewCount: 1,
                        metadata: event.metadata
                    });
                } else {
                    const existing = visitedProducts.get(event.producto.id_producto);
                    existing.lastView = event.fecha;
                    existing.viewCount++;
                }
            }
        });

        const addedToCartProducts = new Map();
        userEvents.filter(e => e.tipo_evento === "ADD_TO_CART").forEach(event => {
            if (event.producto) {
                const quantity = event.metadata?.quantity || 1;
                if (!addedToCartProducts.has(event.producto.id_producto)) {
                    addedToCartProducts.set(event.producto.id_producto, {
                        id_producto: event.producto.id_producto,
                        nombre_producto: event.producto.nombre_producto,
                        precio_actual: event.producto.precio,
                        timestamps: [event.fecha],
                        totalQuantityAdded: quantity,
                    });
                } else {
                    const existing = addedToCartProducts.get(event.producto.id_producto);
                    existing.timestamps.push(event.fecha);
                    existing.totalQuantityAdded += quantity;
                }
            }
        });

        const purchasedProducts = new Map();
        userPurchases.forEach(item => {
            if (item.producto && item.venta) {
                purchasedProducts.set(item.producto.id_producto, {
                    id_producto: item.producto.id_producto,
                    nombre_producto: item.producto.nombre_producto,
                    cantidad_comprada: item.cantidad,
                    precio_unitario_compra: item.precio_unitario,
                    fecha_compra: item.venta.fecha_solicitud, // Esto ahora debería funcionar
                    id_venta: item.venta.id_venta,
                    estado_pago_venta: item.venta.estado_pago,
                });
            }
        });

        const productsViewedButNotBought = [];
        visitedProducts.forEach((prodDetails, id) => {
            if (!purchasedProducts.has(id)) {
                productsViewedButNotBought.push({
                    id_producto: prodDetails.id_producto,
                    nombre_producto: prodDetails.nombre_producto,
                    firstView: prodDetails.firstView,
                    lastView: prodDetails.lastView,
                    viewCount: prodDetails.viewCount,
                    addedToCart: addedToCartProducts.has(id),
                });
            }
        });

        handleSuccess(res, 200, "Actividad del usuario obtenida", {
            user: userData,
            activity: {
                visitedProducts: Array.from(visitedProducts.values()),
                addedToCartProducts: Array.from(addedToCartProducts.values()),
                purchasedProducts: Array.from(purchasedProducts.values()),
                productsViewedButNotBought,
                summary: {
                    totalViews: Array.from(visitedProducts.values()).reduce((sum, p) => sum + p.viewCount, 0),
                    totalAddedToCart: Array.from(addedToCartProducts.values()).reduce((sum, p) => sum + p.totalQuantityAdded, 0),
                    totalPurchasedItems: Array.from(purchasedProducts.values()).reduce((sum, p) => sum + p.cantidad_comprada, 0),
                    // Necesitas calcular el totalSalesValue de userPurchases, que ahora contendrá los subtotales directamente
                    totalSalesValue: Array.from(userPurchases).reduce((sum, p) => sum + (parseFloat(p.subtotal) || 0), 0),
                    uniqueEventTypes: [...new Set(userEvents.map(e => e.tipo_evento))],
                    totalEvents: userEvents.length,
                    totalSales: userPurchases.length > 0 ? new Set(userPurchases.map(p => p.venta.id_venta)).size : 0,
                }
            },
        });

    } catch (err) {
        console.error("Error al obtener actividad del usuario:", err);
        handleErrorServer(res, 500, "Error al obtener la actividad del usuario", err.message);
    }
};