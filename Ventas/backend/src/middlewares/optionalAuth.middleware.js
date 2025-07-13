"use strict";
import passport from "passport";

/**
 * Middleware de autenticación opcional
 * Si hay un token válido, establece req.user
 * Si no hay token o es inválido, continúa sin req.user
 */
export function optionalAuthJwt(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Error en autenticación opcional:", err);
      // En caso de error, continuar sin usuario
      return next();
    }
    
    if (user) {
      // Si el token es válido, establecer el usuario
      req.user = user;
    }
    
    // Continuar independientemente de si hay usuario o no
    next();
  })(req, res, next);
}
