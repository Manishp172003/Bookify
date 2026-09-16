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
} from "../controllers/authController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─── Public Auth Routes ───────────────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.post("/logout", logout);

// ─── Password Reset (public — no auth token required) ────────────────────────
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ─── OTP Verification (public) ───────────────────────────────────────────────
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// ─── Settings Routes (Protected) ─────────────────────────────────────────────
router.get("/settings", verifyToken, getUserSettings);
router.put("/settings/profile", verifyToken, updateProfile);
router.put("/settings/privacy", verifyToken, updatePrivacy);
router.put("/settings/address", verifyToken, updateAddress);
router.put("/settings/payment", verifyToken, updatePayment);
router.put("/settings/notifications", verifyToken, updateNotifications);
router.put("/settings/password", verifyToken, updatePassword);

export default router;