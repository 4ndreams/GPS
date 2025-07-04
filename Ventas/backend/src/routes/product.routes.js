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
import { isAdmin } from "../middlewares/autorization.middleware.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.use(authenticateJwt, isAdmin); // 🔒 Solo admin puede crear/editar/borrar

router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
