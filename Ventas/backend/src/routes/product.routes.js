// src/routes/product.routes.ts
import { Router } from "express";
import multer from "multer";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductoConImagenesController,
  updateProductoConImagenesController,
} from "../controllers/product.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin, authorizeRoles } from "../middlewares/autorization.middleware.js";

const router = Router();

// Configuración de multer para múltiples archivos
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getProducts);
router.get("/:id", getProductById);

// Permisos específicos por endpoint
router.post("/", authenticateJwt, authorizeRoles(["administrador", "fabrica"]), createProduct);
router.patch("/:id", authenticateJwt, authorizeRoles(["administrador"]), updateProduct);
router.delete("/:id", authenticateJwt, authorizeRoles(["administrador"]), deleteProduct);

// Nuevos endpoints para productos con imágenes
router.post(
  "/con-imagenes", 
  authenticateJwt, 
  authorizeRoles(["administrador", "fabrica"]), 
  upload.array("imagenes", 10), // Máximo 10 imágenes
  createProductoConImagenesController
);

router.patch(
  "/:id/con-imagenes", 
  authenticateJwt, 
  authorizeRoles(["administrador", "fabrica"]), 
  upload.array("imagenes", 10), // Máximo 10 imágenes
  updateProductoConImagenesController
);

export default router;
