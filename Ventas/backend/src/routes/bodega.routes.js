import { Router } from "express";
import { getBodegaController,getBodegasController,deleteBodegaController,updateBodegaController,createBodegaController} from "../controllers/bodega.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizeRoles } from "../middlewares/autorization.middleware.js";

const router = Router();
router
    .get("/", authenticateJwt, authorizeRoles(["administrador", "fabrica"]), getBodegasController)
    .get("/:id_bodega", authenticateJwt, authorizeRoles(["administrador", "fabrica"]), getBodegaController)
    .post("/", authenticateJwt, authorizeRoles(["fabrica", "administrador"]), createBodegaController)
    .put("/:id_bodega", authenticateJwt, authorizeRoles(["fabrica", "administrador"]), updateBodegaController)
    .delete("/:id_bodega", authenticateJwt, authorizeRoles(["administrador"]), deleteBodegaController);

export default router;