import { Router } from "express";
import { getBodegaController,getBodegasController,deleteBodegaController,updateBodegaController,createBodegaController} from "../controllers/bodega.controller.js";

const router = Router();
router
    .get("/", getBodegasController)
    .get("/:id_bodega", getBodegaController)
    .post("/", createBodegaController)
    .put("/:id_bodega", updateBodegaController)
    .delete("/:id_bodega", deleteBodegaController);

export default router;