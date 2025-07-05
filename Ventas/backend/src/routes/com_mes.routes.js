import { Router }   from "express";
import {  compras_totales_filtradas} from "../function/Com_mes.function.js";
import { handleErrorClient,handleErrorServer,handleSuccess } from "../handlers/responseHandlers.js";
const router = Router();

router.get("/filtradas", async (req, res) => {
    const body = req.body;
    const [compras, error] = await compras_totales_filtradas(body);
    if (error) {
        if (error.includes("Formato de fecha inválido")) {
            return handleErrorClient(res, 400, error);
        }else if (error.includes("No se encontraron compras")) {
            return handleErrorClient(res, 404, error);
        }else {
            return handleErrorServer(res, 500, error);
        }
    }
    return handleSuccess(res, 200, "Compras totales filtradas obtenidas correctamente", compras);
});

export default router;