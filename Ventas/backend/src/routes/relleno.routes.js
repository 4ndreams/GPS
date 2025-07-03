import { Router } from "express";
import { getRellenosController, getRellenoController, createRellenoController, updateRellenoController, deleteRellenoController } from "../controllers/relleno.controller.js";

const router = Router();
router
    .get("/", getRellenosController)
    .get("/:id_relleno", getRellenoController)
    .post("/", createRellenoController)
    .put("/:id_relleno", updateRellenoController)
    .delete("/:id_relleno", deleteRellenoController);

export default router;