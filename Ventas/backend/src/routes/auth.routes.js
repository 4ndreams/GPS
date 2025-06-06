"use strict";
import { Router } from "express";
import passport from "../auth/passport.auth.js";
import { login, logout, register, recoverPassword, verifyEmail } from "../controllers/auth.controller.js";

const router = Router();

router
  .post("/login", login)
  .post("/register", register)
  .post("/logout", logout)
  .post("/recover-password", recoverPassword)
  .get("/verify-email", verifyEmail);

router.get("/auth/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);

router.get("/auth/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    res.json({ message: "Autenticación con Facebook exitosa", user: req.user });
  }
);

router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.json({ message: "Autenticación con Google exitosa", user: req.user });
  }
);


export default router;