import { Router } from "express";
import {
  getProductosDestacadosController,
  addProductoDestacadoController,
  removeProductoDestacadoController,
} from "../controllers/producto_destacado.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/autorization.middleware.js";

const router = Router();
router
  .get("/", getProductosDestacadosController) // Público
  .post("/", authenticateJwt, authorizeRoles("administrador", "fabrica"), addProductoDestacadoController) // Solo admin
  .delete("/", authenticateJwt, authorizeRoles("administrador", "fabrica"), removeProductoDestacadoController)
  .delete("/:id", authenticateJwt, authorizeRoles("administrador", "fabrica"), removeProductoDestacadoController);
export default router;
