import { Router }   from "express";
import { compras_totales } from "../function/Com_mes.function.js";

const router = Router();
router.get("/", async (req, res) => {
    const body = req.body;
    const [compras, error] = await compras_totales(body);
    if (error) {
        return res.status(500).json({ error: "Error al obtener compras totales" });
    }
    return res.status(200).json(compras);
});

export default router;