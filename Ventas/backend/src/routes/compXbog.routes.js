import { Router } from "express";
import { crearCompXBod } from "../function/Com_bod.function.js";

const router = Router();
router.post("/", async (req, res) => {
    const body = req.body;
    const [message, error] = await crearCompXBod(body);
    if (error) {
        return res.status(500).json({ error: "Error al crear compra" });
    }
    return res.status(200).json({ message });
});

export default router;