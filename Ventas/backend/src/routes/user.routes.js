"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/autorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  getProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.use(authenticateJwt); // Aplica JWT a todas las rutas siguientes

router.get("/profile", getProfile);

router.use(isAdmin); // Solo admin para las siguientes

router
  .get("/", getUsers)
  .get("/detail/", getUser)
  .patch("/detail/", updateUser)
  .delete("/detail/", deleteUser);

export default router;

