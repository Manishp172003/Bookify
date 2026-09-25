import express from "express";
import {
  register,
  login,
  adminLogin,
  logout,
  forgotPassword,
  resetPassword,
  verifyOTP,
  resendOTP,
  getUserSettings,
  updateProfile,
  updatePrivacy,
  updateAddress,
  updatePayment,
  updateNotifications,
  updatePassword,
  switchRole,
  googleLogin,
  githubLogin,
} from "../controllers/authController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { rateLimit } from "../middleware/rateLimiter.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Please wait 1 minute before retrying.",
});

// ─── Role Switch Route (Protected) ────────────────────────────────────────────
router.post("/switch-role", verifyToken, switchRole);

// ─── Public Auth Routes ───────────────────────────────────────────────────────
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/google", googleLogin);
router.post("/github", githubLogin);
router.post("/admin-login", authLimiter, adminLogin);
router.post("/logout", logout);

// ─── Password Reset (public — no auth token required) ────────────────────────
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

// ─── OTP Verification (public) ───────────────────────────────────────────────
router.post("/verify-otp", authLimiter, verifyOTP);
router.post("/resend-otp", authLimiter, resendOTP);

// ─── Settings & Profile Routes (Protected) ──────────────────────────────────
router.get("/profile", verifyToken, getUserSettings);
router.get("/me", verifyToken, getUserSettings);
router.put("/profile", verifyToken, updateProfile);
router.get("/settings", verifyToken, getUserSettings);
router.put("/settings/profile", verifyToken, updateProfile);
router.put("/settings/privacy", verifyToken, updatePrivacy);
router.put("/settings/address", verifyToken, updateAddress);
router.put("/settings/payment", verifyToken, updatePayment);
router.put("/settings/notifications", verifyToken, updateNotifications);
router.put("/settings/password", verifyToken, updatePassword);

export default router;