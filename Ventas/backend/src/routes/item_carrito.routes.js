import { Router } from "express";
import {
    getItemCarritoController,
    getItemsCarritoController,
    createItemCarritoController,
    updateItemCarritoController,
    deleteItemCarritoController
} from "../controllers/item_carrito.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

// Todas las operaciones de carrito requieren autenticación
router.use(authenticateJwt);

router
    .get("/", getItemsCarritoController)
    .get("/:id_item_carrito", getItemCarritoController)
    .post("/", createItemCarritoController)
    .put("/:id_item_carrito", updateItemCarritoController)
    .delete("/:id_item_carrito", deleteItemCarritoController);
export default router;