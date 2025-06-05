import { Router } from "express";
import authRoutes from "./auth.routes.js";
import contactRoutes from "./contact.routes.js"; // 👈 importar

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "¡API funcionando!" });
});


router.use(authRoutes);       
router.use(contactRoutes);    

export default router;
