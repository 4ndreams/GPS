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
  updateProfile
} from "../controllers/user.controller.js";

const router = Router();

router.use(authenticateJwt); // Aplica JWT a todas las rutas siguientes

router.get("/profile", getProfile);
router.patch("/profile/edit", updateProfile); 

router.use(isAdmin); 
router
  .get("/", getUsers)
  .get("/detail/:id_usuario", getUser)
  .patch("/detail/:id_usuario", updateUser)
  .delete("/detail/:id_usuario", deleteUser);

export default router;

