import { Router } from "express";
import { getRellenosController, getRellenoController, createRellenoController, updateRellenoController, deleteRellenoController } from "../controllers/relleno.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isFabricaOrAdmin, authorizeRoles } from "../middlewares/autorization.middleware.js";

const router = Router();
router
    .get("/", getRellenosController) // Público - consulta de rellenos
    .get("/:id_relleno", getRellenoController) // Público - consulta de un relleno específico
    .post("/", authenticateJwt, isFabricaOrAdmin, createRellenoController) // Solo fábrica/admin pueden crear
    .put("/:id_relleno", authenticateJwt, isFabricaOrAdmin, updateRellenoController) // Solo fábrica/admin pueden editar
    .delete("/:id_relleno", authenticateJwt, authorizeRoles('administrador'), deleteRellenoController); // Solo admin puede eliminar

export default router;