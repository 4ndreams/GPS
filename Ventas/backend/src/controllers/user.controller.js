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
import { getUserActivityService } from "../services/userActivity.service.js";

import { AppDataSource } from "../config/configDb.js";
import UsuarioSchema from "../entity/user.entity.js";
import UserEventSchema from "../entity/userEvent.entity.js";
import VentaSchema from "../entity/venta.entity.js";
import DetalleVentaSchema from "../entity/detalleVenta.entity.js";
import ProductoSchema from "../entity/producto.entity.js";

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

    const [user, userError] = await updateUserService({ rut, id, email }, body);

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
  const { id_usuario } = req.params;

  try {
    const { id_usuario } = req.params;
    const result = await getUserActivityService({
      id_usuario,
      query: req.query,
    });
    if (!result) {
      return handleErrorClient(res, 404, "Actividad del usuario no encontrada");
    }

    return handleSuccess(res, 200, "Actividad del usuario obtenida", result);
  } catch (err) {
    if (
      err.message === "Usuario no encontrado" ||
      err.message.includes("se requiere")
    ) {
      return handleErrorClient(res, 404, err.message);
    }

    console.error("Error en getUserActivity:", err);
    return handleErrorServer(
      res,
      500,
      "Error interno al obtener la actividad del usuario",
      err.message
    );
  }
};
