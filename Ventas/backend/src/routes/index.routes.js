import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "¡API funcionando!" });
});

// Montamos las rutas de auth directamente, sin prefijo extra
router.use(authRoutes);

export default router;
