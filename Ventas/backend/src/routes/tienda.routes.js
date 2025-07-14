import { Router } from "express";
import { 
    getTiendaController, 
    getTiendasController, 
    deleteTiendaController, 
    updateTiendaController, 
    createTiendaController 
} from "../controllers/tienda.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/autorization.middleware.js";

const router = Router();

router
    .get("/", authenticateJwt, authorizeRoles(["administrador", "fabrica", "tienda"]), getTiendasController)
    .get("/:id_tienda", authenticateJwt, authorizeRoles(["administrador", "fabrica", "tienda"]), getTiendaController)
    .post("/", authenticateJwt, authorizeRoles(["administrador"]), createTiendaController)
    .put("/:id_tienda", authenticateJwt, authorizeRoles(["administrador"]), updateTiendaController)
    .delete("/:id_tienda", authenticateJwt, authorizeRoles(["administrador"]), deleteTiendaController);

export default router;