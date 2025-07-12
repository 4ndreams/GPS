import { Router } from "express";
import {añadir_puertas} from "../function/Bodega.function.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isFabricaOrAdmin } from "../middlewares/autorization.middleware.js";

const router = Router();

router.post("/", async (req, res) => {
    const body = req.body;
    const [message, error] = await añadir_puertas(body);
    if (error) {
        if (error.includes("No hay suficiente stock de material") || error.includes("No hay suficiente stock de relleno")) {
            return res.status(400).json({ error: error });
        } else {
            return res.status(500).json({ error: error });
        }
    }
    return res.status(200).json({ message });
});
export default router;