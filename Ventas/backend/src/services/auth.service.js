"use strict";
import User from "../entity/user.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET, RESET_PASSWORD_URL } from "../config/configEnv.js";
import { addMinutes, isBefore } from "date-fns";
import { sendLoginAlertEmail } from "../helpers/email.helper.js";


const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15; // in minutes

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const userFound = await userRepository.findOne({
      where: { email: email }, // asegúrate que el campo es "email"
    });

    if (!userFound) {
      return [null, createErrorMessage("email", "El email electrónico es incorrecto")];
    }

    // Revisar si la cuenta está temporalmente bloqueada
    if (userFound.bloqueadoHasta && isBefore(new Date(), userFound.bloqueadoHasta)) {
      return [null, createErrorMessage("email", "Cuenta temporalmente bloqueada por intentos fallidos. Intenta más tarde.")];
    }

    const isMatch = await comparePassword(password, userFound.password);

    if (!isMatch) {
      userFound.intentosFallidos = (userFound.intentosFallidos || 0) + 1;

      if (userFound.intentosFallidos >= MAX_LOGIN_ATTEMPTS) {
        userFound.bloqueadoHasta = addMinutes(new Date(), LOCK_TIME);
        userFound.intentosFallidos = 0;

        await userRepository.save(userFound);
        await sendLoginAlertEmail(userFound.email);

        return [null, createErrorMessage("email", "Cuenta bloqueada temporalmente. Revisa tu email.")];
      }

      await userRepository.save(userFound);
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    // Login exitoso: resetea contador de fallos
    userFound.intentosFallidos = 0;
    userFound.bloqueadoHasta = null;
    await userRepository.save(userFound);

    const payload = {
      nombreCompleto: userFound.nombre + " " + userFound.apellidos,
      email: userFound.email,
      rut: userFound.rut,
      rol: userFound.rol,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return [accessToken, null];

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { nombreCompleto, rut, email } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const existingEmailUser = await userRepository.findOne({
      where: {
        email,
      },
    });
    
    if (existingEmailUser) return [null, createErrorMessage("email", "email electrónico en uso")];

    const existingRutUser = await userRepository.findOne({
      where: {
        rut,
      },
    });

    if (existingRutUser) return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];

    const newUser = userRepository.create({
      nombre: user.nombre,
      apellidos: user.apellidos,
      rut: user.rut,
      email: user.email,
      password: await encryptPassword(user.password),
      rol: "Cliente", // Default role
    });

    await userRepository.save(newUser);

    const { password, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}

export async function recoverPasswordService(token, newPassword) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    let payload;
    try {
      payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
      return [null, "Token inválido o expirado"];
    }

    const user = await userRepository.findOne({ where: { correo: payload.email } });

    if (!user) return [null, "Usuario no encontrado"];

    user.password = await encryptPassword(newPassword);
    await userRepository.save(user);

    return [true, null];
  } catch (error) {
    console.error("Error en recuperación de contraseña:", error);
    return [null, "Error interno del servidor"];
  }
}