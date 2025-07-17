"use strict";
import User from "../entity/user.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET} from "../config/configEnv.js";
import { addMinutes, isBefore } from "date-fns";
import { sendLoginAlertEmail, sendVerificationEmail } from "../helpers/email.helper.js";
import TokenService from "./token.service.js";


const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 3; // in minutes

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const userFound = await userRepository.findOne({
      where: { email: email }, 
    });

    if (!userFound) {
      return [null, createErrorMessage("email", "El email electrónico es incorrecto")];
    }

    // Revisar si la cuenta está temporalmente bloqueada
    if (userFound.bloqueadoHasta && isBefore(new Date(), userFound.bloqueadoHasta)) {
      return [null, createErrorMessage("email", "Cuenta temporalmente bloqueada por intentos fallidos. Intenta más tarde.")];
    }

    console.log("userFound.password:", userFound.password);
    console.log("Tipo de userFound.password:", typeof userFound.password);

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

    // Usar TokenService para generar el token con gestión de expiración
    const accessToken = TokenService.generateToken(payload);

    return [accessToken, null];

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { nombre, apellidos, rut, email, password, rol } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const existingEmailUser = await userRepository.findOne({ where: { email } });
    if (existingEmailUser) return [null, createErrorMessage("email", "Correo electrónico en uso")];

    const existingRutUser = await userRepository.findOne({ where: { rut } });
    if (existingRutUser) return [null, createErrorMessage("rut", "RUT ya asociado a una cuenta")];

    // Generar un token con todos los datos del usuario (excepto password en texto plano)
    const verificationToken = jwt.sign(
      {
        nombre,
        apellidos,
        rut,
        email,
        rol,
        password: await encryptPassword(password),
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    // Enviar email con enlace de verificación
    await sendVerificationEmail(email, verificationToken);

    return [{ email, mensaje: "Correo de verificación enviado" }, null];
  } catch (error) {
    console.error("Error al registrar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function verifyEmailService(token) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    let payload;
    try {
      payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
      console.error("Error al verificar el token de recuperación de contraseña:", err);
      return [null, "Token inválido o expirado"];
    }

    const existingUser = await userRepository.findOne({ where: { email: payload.email } });
    if (existingUser) return [null, "El correo electrónico ya está en uso"];

    const newUser = userRepository.create({
      nombre: payload.nombre,
      apellidos: payload.apellidos,
      rut: payload.rut,
      email: payload.email,
      password: payload.password,
      rol: payload.rol || "cliente", // Default role if not provided
    });

    await userRepository.save(newUser);
    return [newUser, null];
  } catch (error) {
    console.error("Error al verificar el correo electrónico:", error);
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
      return ["Error: Token inválido o expirado, " + err];
    }

    const user = await userRepository.findOne({ where: {email: payload.email } });

    if (!user) return [null, "Usuario no encontrado"];

    user.password = await encryptPassword(newPassword);
    await userRepository.save(user);

    return [true, null];
  } catch (error) {
    console.error("Error en recuperación de contraseña:", error);
    return [null, "Error interno del servidor"];
  }
}

export const verifyEmail = async (token) => {
  return axios.get(`${API_BASE_URL}/verify-email`, { params: { token } });
};