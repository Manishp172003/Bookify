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

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─── Role Switch Route (Protected) ────────────────────────────────────────────
router.post("/switch-role", verifyToken, switchRole);

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

router.get("/analytics", getAnalytics);

router.get("/earnings", getEarnings);
router.get("/payouts", getPayouts);
router.post("/payouts", requestPayout);

router.get("/coupons", getCoupons);
router.post("/coupons", createCoupon);
router.patch("/coupons/:id/toggle", toggleCoupon);
router.delete("/coupons/:id", deleteCoupon);

export default router;