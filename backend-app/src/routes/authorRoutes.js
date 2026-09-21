import express from "express";

import {
  getMyBooks,
  submitBook,
  getAnalytics,
  getEarnings,
  createCoupon,
  getCoupons,
  toggleCoupon,
  deleteCoupon,
  validateCoupon,
  updateProfile,
  submitVerification,
} from "../controllers/authorController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import {
  uploadSingle,
  uploadMultiple,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ─── Author Profile & Verification (Protected: Student / Author / Admin) ──────
router.put(
  "/profile",
  protect,
  uploadSingle("avatar", "bookify/avatars"),
  updateProfile
);

router.post(
  "/verify",
  protect,
  uploadMultiple(
    [
      { name: "idDoc", maxCount: 1 },
      { name: "degreeDoc", maxCount: 1 },
    ],
    "bookify/verification"
  ),
  submitVerification
);

// ─── Coupon Validation (Public/Protected for checkout) ────────────────────────
router.post("/coupons/validate", validateCoupon);

// ─── Author Studio Operations (Protected: Author & Admin only) ────────────────
router.use(protect, authorize("author", "admin"));

router.get("/my-books", getMyBooks);
router.post("/books", uploadSingle("image", "bookify/books"), submitBook);
router.get("/analytics", getAnalytics);
router.get("/earnings", getEarnings);

// Coupon management
router.post("/coupons", createCoupon);
router.get("/coupons", getCoupons);
router.patch("/coupons/:id", toggleCoupon);
router.delete("/coupons/:id", deleteCoupon);

export default router;