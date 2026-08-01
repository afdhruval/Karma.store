import { Router } from "express";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../validator/auth.validator.js";
import {
  getMe,
  googleCallback,
  login,
  register,
  logout,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Frontend origin — used as fallback state and failure redirect
const FRONTEND_URL =
  config.NODE_ENV === "production"
    ? "https://karmastore-iota.vercel.app"
    : "http://localhost:5173";

router.post("/register", validateRegisterUser, register);

router.post("/login", validateLoginUser, login);

router.post("/logout", logout);

// /api/auth/google
router.get("/google", (req, res, next) => {
  // Capture the frontend origin from Referer header; fall back to configured URL
  const origin = req.headers.referer
    ? new URL(req.headers.referer).origin
    : FRONTEND_URL;
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: origin, // Forward origin in state parameter so callback can redirect back
  })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err || !user) {
      console.error("Google authentication error:", err || info);
      return res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
    }
    req.user = user;
    return googleCallback(req, res);
  })(req, res, next);
});

/**
 * @route GET /api/auth/me
 * @description Get the authenticated user's profile
 * @access Private
 */
router.get("/me", authenticateUser, getMe);

export default router;
