import { Router } from "express";
import { enviarMensaje } from "../controllers/contact.controller.js";

const router = Router();

router.post("/contacto", enviarMensaje); // <-- esto debe estar presente

export default router;