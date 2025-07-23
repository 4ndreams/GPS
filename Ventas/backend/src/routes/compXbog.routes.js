import { Router } from "express";
import { crearCompXBod } from "../function/Com_bod.function.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isFabricaOrAdmin } from "../middlewares/autorization.middleware.js";

const router = Router();



router.post("/", async (req, res) => {
    const body = req.body;
    const [message, error] = await crearCompXBod(body);
    if (error) {
        if (error.includes("El tipo de la compra debe" || "Debe especificar un material o un relleno")) {
            return handleErrorClient(res, 400, error);
        } else if (error.includes("No se pudo crear la compra")) {
            return handleErrorClient(res, 404, error);
        } else {
            return handleErrorServer(res, 500, error);
        }
        
    }
    return handleSuccess(res, 200, "Compra creada y almacenada en bodega correctamente", message);
});

export default router;