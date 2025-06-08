"use strict";
import { Router } from "express";
import { isAdmin } from "../../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  getProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/profile", getProfile);

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .get("/", getUsers)
  .get("/detail/", getUser)
  .patch("/detail/", updateUser)
  .delete("/detail/", deleteUser);

export default router;