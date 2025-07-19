"use strict";
import { loginService, registerService, recoverPasswordService, verifyEmailService} from "../services/auth.service.js";
import TokenService from "../services/token.service.js";
import {
  authValidation,
  registerValidation,
} from "../validations/auth.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function login(req, res) {
  try {
    const { body } = req;

    const { error } = authValidation.validate(body);

    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }
    const [accessToken, errorToken] = await loginService(body);

    if (errorToken) return handleErrorClient(res, 400, "Error iniciando sesión", errorToken);

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax", // o "lax" si tienes problemas
      secure: false,      // true solo si usas HTTPS
    });

    handleSuccess(res, 200, "Inicio de sesión exitoso", { token: accessToken });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function register(req, res) {
  try {
    const { body } = req;

    const { error } = registerValidation.validate(body);

    if (error)
      return handleErrorClient(res, 400, "Error de validación", error.message);

    const [newUser, errorNewUser] = await registerService(body);

    if (errorNewUser) return handleErrorClient(res, 400, "Error registrando al usuario", errorNewUser);

    handleSuccess(res, 201, "Usuario registrado con éxito", newUser);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function logout(req, res) {
  try {
    // Obtener el token del header de autorización
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (token) {
      // Invalidar el token usando el TokenService
      const result = TokenService.invalidateToken(token);
      if (!result.success) {
        console.warn('⚠️ Error al invalidar token durante logout:', result.message);
      }
    }

    // Limpiar cookie JWT
    res.clearCookie("jwt", { 
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    handleSuccess(res, 200, "Sesión cerrada exitosamente", {
      message: "Token invalidado y sesión terminada"
    });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function recoverPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return handleErrorClient(res, 400, "Faltan datos requeridos");
    }

    const [, error] = await recoverPasswordService(token, newPassword);

    if (error) {
      return handleErrorClient(res, 400, "Error al recuperar la contraseña", error);
    }

    handleSuccess(res, 200, "Contraseña actualizada con éxito");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      // Redirige al frontend con error
      return res.redirect(`${process.env.VITE_API_BASE_URL}/verified-email?success=false&message=Token%20de%20verificación%20requerido`);
    }

    const [, error] = await verifyEmailService(token);

    if (error) {
      // Redirige al frontend con error y mensaje
      return res.redirect(`${process.env.VITE_API_BASE_URL}/verified-email?success=false&message=${encodeURIComponent(error)}`);
    }
    // Redirige al frontend con éxito
    return res.redirect(`${process.env.VITE_API_BASE_URL}/verified-email?success=true`);
  } catch (error) {
    // Redirige al frontend con error inesperado
    return res.redirect(`${process.env.VITE_API_BASE_URL}/verified-email?success=false&message=${encodeURIComponent(error.message)}`);
  }
}

export async function refreshToken(req, res) {
  try {
    // Obtener el token del header de autorización
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return handleErrorClient(res, 401, "Token requerido para renovación");
    }

    // Intentar renovar el token
    const [newToken, error] = await TokenService.refreshToken(token);

    if (error) {
      return handleErrorClient(res, 401, "Error al renovar token", error);
    }

    // Configurar cookie con el nuevo token
    res.cookie("jwt", newToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    handleSuccess(res, 200, "Token renovado exitosamente", { 
      token: newToken,
      message: "Sesión extendida por 24 horas"
    });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getTokenInfo(req, res) {
  try {
    // Obtener el token del header de autorización
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return handleErrorClient(res, 401, "Token requerido");
    }

    // Obtener información del token
    const tokenInfo = TokenService.getTokenInfo(token);

    if (!tokenInfo.valid) {
      return handleErrorClient(res, 401, "Token inválido", tokenInfo.error);
    }

    handleSuccess(res, 200, "Información del token obtenida", {
      issuedAt: tokenInfo.issuedAt,
      expiresAt: tokenInfo.expiresAt,
      timeRemainingSeconds: tokenInfo.timeRemaining,
      shouldRefresh: tokenInfo.shouldRefresh,
      user: tokenInfo.user
    });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}