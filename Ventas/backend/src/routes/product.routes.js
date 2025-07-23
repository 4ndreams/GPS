// src/routes/product.routes.ts
import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin, authorizeRoles } from "../middlewares/autorization.middleware.js";

const router = Router();

router.get("/all", getProducts);
router.get("/:id", getProductById);

// Permisos específicos por endpoint
router.post("/", authenticateJwt, authorizeRoles(["administrador", "fabrica"]), createProduct);
router.patch("/:id", authenticateJwt, authorizeRoles(["administrador"]), updateProduct);
router.delete("/:id", authenticateJwt, authorizeRoles(["administrador"]), deleteProduct);

export default router;
