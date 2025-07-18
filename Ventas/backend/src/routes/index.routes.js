import { Router } from "express";
import authRoutes from "./auth.routes.js";
import contactRoutes from "./contact.routes.js"; 
import userRoutes from "./user.routes.js";
import bodegaRoutes from "./bodega.routes.js"; 
import imagenRoutes from "./imagen.routes.js"; 
import tipoRoutes from "./tipo.routes.js"; 
import materialRoutes from "./material.routes.js";
import ordenRoutes from "./orden.routes.js"; 
import ventaRoutes from "./venta.routes.js"; 
import itemCarritoRoutes from "./item_carrito.routes.js"; 
import comprasRoutes from "./compras.routes.js";
import compXbogRoutes from "./compXbog.routes.js";
import com_mesRoutes from "./com_mes.routes.js";
import productRoutes from "./product.routes.js";

import rellenoRoutes from "./relleno.routes.js"; // Import relleno routes
import productoPersonalizadoRoutes from "./producto_personalizado.routes.js"; // Import producto personalizado routes

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "¡API funcionando!" });
});


router.use(authRoutes);       
router.use(contactRoutes);
router.use('/bodega',bodegaRoutes);  
router.use('/imagen', imagenRoutes);
router.use('/tipo', tipoRoutes);
router.use('/material', materialRoutes);
router.use('/orden', ordenRoutes);
router.use('/venta', ventaRoutes);
router.use('/item_carrito', itemCarritoRoutes);

router.use('/compras', comprasRoutes);
router.use('/users',userRoutes); 
router.use('/compXbog', compXbogRoutes); 
router.use('/com_mes', com_mesRoutes);

router.use('/users',userRoutes);  
router.use('/products', productRoutes); 
router.use('/materiales', materialRoutes);
router.use('/tipos', tipoRoutes); 

router.use('/rellenos', rellenoRoutes); 
router.use('/productos-personalizados', productoPersonalizadoRoutes); // Rutas para cotizaciones/productos personalizados

export default router;
