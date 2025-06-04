import { Router } from "express";
import authRoutes from "./auth.routes.js"; 

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "¡API funcionando!" });
});

router.use("/auth", authRoutes); 

router.stack.forEach(layer => {
  if (layer.route) {
    console.log(`Ruta registrada: ${layer.route.path}`);
  }
});

export default router;
