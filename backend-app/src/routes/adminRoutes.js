import express from "express";

import {
  getMetrics,
  getListings,
  moderateListing,
  getOrdersEscrow,
  updateEscrow,
  getUsers,
  getAuthorsForVerification,
  verifyAuthor,
  getDisputes,
  getAdminCoupons,
  createAdminCoupon,
  updateCouponStatus,
  deleteAdminCoupon,
} from "../controllers/adminController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, authorize("admin"));

// ─── Platform Metrics ─────────────────────────────────────────────────────────
router.get("/metrics", getMetrics);

// ─── Listing Moderation ───────────────────────────────────────────────────────
router.get("/listings", getListings);
router.patch("/listings/:id", moderateListing);

// ─── Escrow Management ────────────────────────────────────────────────────────
router.get("/orders-escrow", getOrdersEscrow);
router.patch("/orders/:id/escrow", updateEscrow);

// ─── User Management & Author Verification ────────────────────────────────────
router.get("/users", getUsers);
router.get("/authors-verification", getAuthorsForVerification);
router.patch("/authors-verification/:id", verifyAuthor);

// ─── Dispute Handling ─────────────────────────────────────────────────────────
router.get("/disputes", getDisputes);

// ─── Coupon Management ────────────────────────────────────────────────────────
router.get("/coupons", getAdminCoupons);
router.post("/coupons", createAdminCoupon);
router.patch("/coupons/:id", updateCouponStatus);
router.delete("/coupons/:id", deleteAdminCoupon);

export default router;