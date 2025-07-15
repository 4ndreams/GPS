"use strict";

import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  ACCESS_TOKEN_SECRET,
} from "../config/configEnv.js";

import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";

// 🔒 JWT Strategy (para login con email y contraseña)
export function passportJwtSetup() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: ACCESS_TOKEN_SECRET,
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
      try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: { email: jwt_payload.email },
        });

        return user ? done(null, user) : done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );

  console.log("🔐 Estrategia JWT registrada");
}

// 🔄 Facebook y Google OAuth Strategies
export function passportOAuthSetup() {
  // Facebook
  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "emails"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const nombre = profile.displayName || "Usuario Facebook";
          const userRepository = AppDataSource.getRepository(User);
          let user = await userRepository.findOne({ where: { email } });

          if (!user) {
            user = await userRepository.save({
              nombre,
              apellidos: "", // vacío porque Facebook no da apellido separado aquí
              email,
              provider: "facebook",
              rol: "cliente", // asignar rol por defecto
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  console.log("🔵 Estrategia de Facebook registrada");

  // Google
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const nombre = profile.name?.givenName || "Usuario Google";
          const apellidos = profile.name?.familyName || "";

          const userRepository = AppDataSource.getRepository(User);
          let user = await userRepository.findOne({ where: { email } });

          if (!user) {
            user = await userRepository.save({
              nombre,
              apellidos,
              email,
              provider: "google",
              rol: "cliente",
            });
          }

          // Generamos el token JWT
          const token = jwt.sign(
            { email: user.email, id: user.id },
            ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
          );

          return done(null, { ...user, token });
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  console.log("🔴 Estrategia de Google registrada");
}

export default passport;
