import { Router } from "express";
import authRoutes from "./auth.routes.js";
import contactRoutes from "./contact.routes.js"; 
import userRoutes from "./user.routes.js";


const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "¡API funcionando!" });
});


router.use(authRoutes);       
router.use(contactRoutes);  
router.use('/users',userRoutes);  // IMPORTANTE USAR EL PATH /XXXX ANTES DE LAS RUTAS

export default router;
