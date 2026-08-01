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

router.post("/register", validateRegisterUser, register);

router.post("/login", validateLoginUser, login);

router.post("/logout", logout);

// /api/auth/google
router.get("/google", (req, res, next) => {
  // Capture the dynamic frontend origin from Referer (e.g. http://192.168.1.15:5173 or http://localhost:5173)
  const origin = req.headers.referer
    ? new URL(req.headers.referer).origin
    : "http://karma-alb-1909572835.ap-south-1.elb.amazonaws.com/";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: origin, // Forward origin in state parameter
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect:
      "http://karma-alb-1909572835.ap-south-1.elb.amazonaws.com/login",
  }),
  googleCallback,
);

/**
 * @route GET /api/auth/me
 * @description Get the authenticated user's profile
 * @access Private
 */
router.get("/me", authenticateUser, getMe);

export default router;
