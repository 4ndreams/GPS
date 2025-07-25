"use strict";

import express, { json, urlencoded } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import path from "path";

import indexRoutes from "./src/routes/index.routes.js";
import { connectDB } from "./src/config/configDb.js";
import { testConnection } from "./src/config/initialSetup.js";
import { initializeDefaultData } from "./src/config/seedData.js";
import { cookieKey, HOST, PORT } from "./src/config/configEnv.js";
import {
  passportJwtSetup,
  passportOAuthSetup,
} from "./src/auth/passport.auth.js";

const __dirname = path.resolve();

async function setupServer() {
  try {
    const app = express();

    app.disable("x-powered-by");

    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [
        'http://localhost:5173',
        'http://localhost:5174',   
        'http://localhost:3000',  // Para la app móvil en web
        'http://192.168.1.105:3000', 
        'http://192.168.1.105:19000',
        'http://localhost:8081'
      ], 
      origin: true,
      credentials: true
    }));

    app.use(urlencoded({ extended: true, limit: "1mb" }));
    app.use(json({ limit: "1mb" }));
    app.use(cookieParser());
    app.use(morgan("dev"));

    app.use(session({
      secret: cookieKey,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,       // true si usas HTTPS
        httpOnly: true,
        sameSite: "strict",  // evita CSRF
      },
    }));

    // ✅ Passport
    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup();      // JWT strategy
    passportOAuthSetup();    // Google y Facebook

    // ✅ Rutas
    app.use("/api", indexRoutes);

    // ✅ Inicio del servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Servidor corriendo en ${HOST}:${PORT}/api`);
    });

  } catch (error) {
    console.error("❌ Error en setupServer:", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();              // Conexión a la base de datos
    await initializeDefaultData();  // Seeding de datos por defecto
    await setupServer();            // Servidor Express
    await testConnection();         // (Opcional) Validación inicial
  } catch (error) {
    console.error("❌ Error al iniciar la API:", error);
  }
}

setupAPI()
  .then(() => console.log("🚀 API Iniciada exitosamente"))
  .catch((error) => console.error("❌ Error en setupAPI:", error));
