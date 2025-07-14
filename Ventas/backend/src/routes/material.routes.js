import { Router } from "express";
import { getMaterialController, getMaterialsController, deleteMaterialController, updateMaterialController, createMaterialController } from "../controllers/material.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/autorization.middleware.js";

const router = Router();
router
    .get("/", getMaterialsController) // Público - ver materiales para cotizaciones
    .get("/:id_material", getMaterialController) // Público - ver material específico
    .post("/", authenticateJwt, authorizeRoles(["fabrica", "administrador"]), createMaterialController)
    .put("/:id_material", authenticateJwt, authorizeRoles(["fabrica", "administrador"]), updateMaterialController)
    .delete("/:id_material", authenticateJwt, authorizeRoles(["administrador"]), deleteMaterialController);

export default router;

