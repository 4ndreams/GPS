"use strict";
import { Router } from "express";
import { login, logout, register, recoverPassword } from "../controllers/auth.controller.js";

const router = Router();

router
  .post("/login", login)
  .post("/register", register)
  .post("/logout", logout)
  .post("/recover-password", recoverPassword);

export default router;