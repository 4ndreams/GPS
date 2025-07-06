import { Router } from "express";
import { 
    getTiendaController, 
    getTiendasController, 
    deleteTiendaController, 
    updateTiendaController, 
    createTiendaController 
} from "../controllers/tienda.controller.js";

const router = Router();

router
    .get("/", getTiendasController)
    .get("/:id_tienda", getTiendaController)
    .post("/", createTiendaController)
    .put("/:id_tienda", updateTiendaController)
    .delete("/:id_tienda", deleteTiendaController);

export default router;