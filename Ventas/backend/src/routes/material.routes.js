import { Router } from "express";
import { getMaterialController, getMaterialsController, deleteMaterialController, updateMaterialController, createMaterialController } from "../controllers/material.controller.js";

const router = Router();
router
    .get("/", getMaterialsController)
    .get("/:id_material", getMaterialController)
    .post("/", createMaterialController)
    .put("/:id_material", updateMaterialController)
    .delete("/:id_material", deleteMaterialController);

export default router;