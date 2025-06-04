import { Router } from "express";
import authRoutes from "./auth.routes.js"; // Asegúrate de que esta ruta es correcta

const router = Router();

// Ruta básica de prueba
router.get("/", (req, res) => {
  res.json({ message: "¡API funcionando!" });
});

// Aquí montas las rutas de autenticación
router.use("/auth", authRoutes); // Esto habilita /api/auth/register, etc.

export default router;
