import { Router } from "express";
import { getTipos } from "../controllers/tipo.controller.js";

const router = Router();
router.get("/", getTipos);

export default router;
