// src/routes/user.routes.js
"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/autorization.middleware.js"; 
import { authenticateJwt } from "../middlewares/authentication.middleware.js"; 
import {
  deleteUser,
  getUser,
  getUsers,
  createUser,
  updateUser,
  getProfile,
  updateProfile,
  getUserActivity 
} from "../controllers/user.controller.js"; 

const router = Router();

router.use(authenticateJwt);

router.get("/profile", getProfile);
router.patch("/profile/edit", updateProfile);

router.use(isAdmin);

router.get("/detail/:id_usuario/activity", getUserActivity);

router
  .get("/", getUsers) 
  .post("/", createUser)
  .get("/detail/:id_usuario", getUser) 
  .patch("/detail/:id_usuario", updateUser)
  .delete("/detail/:id_usuario", deleteUser); 

export default router;