"use strict";

import express, { json, urlencoded } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { createServer } from "http";
import { Server } from "socket.io";

import indexRoutes from "./src/routes/index.routes.js";
import { connectDB } from "./src/config/configDb.js";
import { testConnection } from "./src/config/initialSetup.js";
import { cookieKey, HOST, PORT } from "./src/config/configEnv.js";
import {
  passportJwtSetup,
  passportOAuthSetup,
} from "./src/auth/passport.auth.js";

async function setupServer() {
  try {
    const app = express();
    const server = createServer(app);

    app.disable("x-powered-by");

    app.use(cors({
      origin: true,  // Permite solicitudes desde cualquier origen
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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

    // ✅ Socket.io setup
    const io = new Server(server, {
      cors: {
        origin: true,
        credentials: true
      }
    });

    // Manejar conexiones de Socket.io
    io.on('connection', (socket) => {
      console.log(`🔌 Cliente conectado: ${socket.id}`);
      
      // Unir al cliente a la sala de notificaciones
      socket.join('notificaciones');
      
      socket.on('disconnect', () => {
        console.log(`🔌 Cliente desconectado: ${socket.id}`);
      });
    });

    // Hacer io disponible globalmente
    global.io = io;

    // ✅ Inicio del servidor
    server.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en ${HOST}:${PORT}/api`);
      console.log(`🔌 Socket.io disponible en ${HOST}:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error en setupServer:", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();       // Conexión a la base de datos
    await setupServer();     // Servidor Express
    await testConnection();  // (Opcional) Validación inicial
  } catch (error) {
    console.error("❌ Error al iniciar la API:", error);
  }
}

setupAPI()
  .then(() => console.log("🚀 API Iniciada exitosamente"))
  .catch((error) => console.error("❌ Error en setupAPI:", error));