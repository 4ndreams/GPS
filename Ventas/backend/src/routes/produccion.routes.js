import { Router } from "express";
import {añadir_puertas} from "../function/Bodega.function.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isFabricaOrAdmin } from "../middlewares/autorization.middleware.js";

const router = Router();
router.use(authenticateJwt);
router.use(isFabricaOrAdmin);
router.put("/", async (req, res) => {
    const body = req.body;
    const [message, error] = await añadir_puertas(body);
    if (error) {
        if (error.includes("No hay suficiente stock de material") || error.includes("No hay suficiente stock de relleno")) {
            return handleErrorClient(res, 400, error);
        } else if (error.includes("Producto no existente")) {
            return handleErrorClient(res, 404, error);
        }else{
            return handleErrorServer(res, 500, error);
        }
    }
    return handleSuccess(res, 200, "Puertas añadidas a la bodega correctamente", message);
});
export default router;