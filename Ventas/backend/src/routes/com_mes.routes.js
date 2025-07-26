import { Router } from "express";
import { compras_totales_filtradas , ventasTotalesPorMes} from "../function/Com_mes.function.js";
import { FiltroCompra , FiltroVenta } from "../function/Filtro.function.js"
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isFabricaOrAdmin } from "../middlewares/autorization.middleware.js";

const router = Router();



router.post("/compras", async (req, res) => {
    console.log("Ruta:", req.body);
    const body = req.body;
    console.log("Cuerpo de la solicitud:", body);
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
router.post("/ventas", async (req, res) => {
    const body = req.body;
    const [ventas, error] = await ventasTotalesPorMes(body);
    if (error) {
        if (error.includes("Formato de fecha inválido")) {
            return handleErrorClient(res, 400, error);
        }else if(error.includes("la fecha inicial no puede ser posterior a la fecha final")) {
            return handleErrorClient(res, 400, error);
        }else if(error.includes("Las fechas no pueden ser mayores a la fecha actual")) {
            return handleErrorClient(res, 400, error);
        }else if(error.includes("No se encontraron ventas en el rangos")) {
            return handleErrorClient(res, 404, error);
        }else if (error.includes("No se encontraron ventas")) {
            return handleErrorClient(res, 404, error);
        }else {
            return handleErrorServer(res, 500, error);
        }
    }
    return handleSuccess(res, 200, "Ventas totales por mes obtenidas correctamente", ventas);
});
router.get("/Filtros", async (req, res) => {
    const [filtros, error] = await FiltroCompra();
    if (error) {
        return handleErrorServer(res, 500, error);
    }
    return handleSuccess(res, 200, "Filtros de compras obtenidos correctamente", filtros);
});
router.get("/FiltrosVentas", async (req, res) => {
    const [filtros, error] = await FiltroVenta();
    if (error) {
        return handleErrorServer(res, 500, error);
    }
    return handleSuccess(res, 200, "Filtros de ventas obtenidos correctamente", filtros);
});


export default router;
