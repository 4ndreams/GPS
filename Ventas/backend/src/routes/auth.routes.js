"use strict";
import { Router } from "express";
import passport from "../auth/passport.auth.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { 
  login, 
  logout, 
  register, 
  recoverPassword, 
  verifyEmail, 
  refreshToken, 
  getTokenInfo, 
  forgotPasswordRequest 
} from "../controllers/auth.controller.js";

const router = Router();

router
  .post("/login", login)
  .post("/register", register)
  .post("/logout", authenticateJwt, logout)
  .post("/refresh-token", refreshToken)
  .get("/token-info", getTokenInfo)
  .post("/recover-password", recoverPassword)
  .post("/forgot-password", forgotPasswordRequest)
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
  
    const user = req.user;
    const token = user.token;
    res.redirect(`${process.env.VITE_API_BASE_URL}/profile?token=${token}`);

  }
);


export default router;