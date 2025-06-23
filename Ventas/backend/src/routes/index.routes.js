import { Router } from "express";
import authRoutes from "./auth.routes.js";
import contactRoutes from "./contact.routes.js"; 
import userRoutes from "./user.routes.js";
import productRoutes from "./product.routes.js";
import materialRoutes from "./material.routes.js";
import tipoRoutes from "./tipo.routes.js";


const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "¡API funcionando!" });
});


router.use(authRoutes);       
router.use(contactRoutes);  
router.use('/users',userRoutes);  // IMPORTANTE USAR EL PATH /XXXX ANTES DE LAS RUTAS
router.use('/products', productRoutes); 
router.use('/materiales', materialRoutes);
router.use('/tipos', tipoRoutes); // Asegúrate de que este es el nombre correcto del archivo

export default router;
