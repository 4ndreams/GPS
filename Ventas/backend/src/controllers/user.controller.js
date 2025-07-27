// src/controllers/user.controller.js
"use strict";
import {
  deleteUserService,
  getUserService,
  getUsersService,
  createUserService,
  updateUserService,
  getProfileService,
  updateProfileService,
} from "../services/user.service.js";
import {
  userBodyValidation,
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
    // Obtener id_usuario desde los parámetros de la URL
    const { id_usuario } = req.params;

    // Validar que el id_usuario esté presente
    if (!id_usuario) {
      return handleErrorClient(res, 400, "id_usuario es requerido");
    }

    const [user, errorUser] = await getUserService({ id: id_usuario });

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

export async function createUser(req, res) {
  try {
    const { body } = req;

    // Validar el body con la validación existente
    const { error: bodyError } = userBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message
      );

    // Crear el usuario
    const [user, userError] = await createUserService(body);

    if (userError)
      return handleErrorClient(
        res,
        400,
        "Error creando el usuario",
        userError
      );

    handleSuccess(res, 201, "Usuario creado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateUser(req, res) {
  try {
    // Obtener id_usuario desde los parámetros de la URL
    const { id_usuario } = req.params;
    const { body } = req;

    // Validar que el id_usuario esté presente
    if (!id_usuario) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        "id_usuario es requerido"
      );
    }

    // Validar el body con la validación existente
    const { error: bodyError } = userBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message
      );

    // Usar el id_usuario desde params en lugar de query
    const [user, userError] = await updateUserService({ id: id_usuario }, body);

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
    // Obtener id_usuario desde los parámetros de la URL
    const { id_usuario } = req.params;

    // Validar que el id_usuario esté presente
    if (!id_usuario) {
      return handleErrorClient(res, 400, "id_usuario es requerido");
    }

    const [userDelete, errorUserDelete] = await deleteUserService({
      id: id_usuario,
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

    console.log('=== UPDATE PROFILE DEBUG ===');
    console.log('User ID:', userId);
    console.log('Request body:', body);
    console.log('Body keys:', Object.keys(body));

    // Valida el body si tienes validación
    const { error: bodyError } = userBodyValidation.validate(body);
    if (bodyError) {
      console.log('Validation error:', bodyError.message);
      console.log('Validation details:', bodyError.details);
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message
      );
    }

    console.log('Validation passed, calling service...');

    const [user, userError] = await updateProfileService(userId, body);

    if (userError) {
      console.log('Service error:', userError);
      return handleErrorClient(
        res,
        400,
        "Error modificando el perfil",
        userError
      );
    }

    console.log('Profile updated successfully');
    handleSuccess(res, 200, "Perfil modificado correctamente", user);
  } catch (error) {
    console.error('Unexpected error in updateProfile:', error);
    handleErrorServer(res, 500, error.message);
  }
}

export const getUserActivity = async (req, res) => {
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
