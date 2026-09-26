import express from "express";

import {
  getAuthorProfile,
  updateAuthorProfile,
  submitAuthorVerification,
  getMyBooks,
  submitBook,
  updateBook,
  deleteBook,
  getCoupons,
  createCoupon,
  toggleCouponStatus,
  deleteCoupon,
  validateCoupon,
  getCampaigns,
  createCampaign,
  updateCampaignStatus,
  deleteCampaign,
  getActiveFeaturedCampaigns,
  trackCampaignEngagement,
  getEarnings,
  requestPayout,
  getPayouts,
  getDashboardStats,
  getAnalytics,
  updateProfile,
  submitVerification,
  toggleCoupon,
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

// ─── Public coupon validation route (used at student checkout) ───────────────
router.post("/coupons/validate", validateCoupon);

// ─── Public Storefront Campaign Promotion & Analytics Routes ─────────────────
router.get("/campaigns/active-featured", getActiveFeaturedCampaigns);
router.post("/campaigns/:id/track", trackCampaignEngagement);

// ─── Author Profile & Verification (Protected: Student / Author / Admin) ──────
router.put(
  "/profile",
  protect,
  uploadSingle("avatar", "bookify/avatars"),
  updateAuthorProfile
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
  submitAuthorVerification
);

// ─── Protect all other author routes (Author & Admin only) ───────────────────
router.use(protect, authorize("author", "admin"));

// 1. Profile & Verification
router.get("/profile", getAuthorProfile);

// 2. Books & Publishing
router.get("/my-books", getMyBooks);
router.post("/books", uploadSingle("image", "bookify/books"), submitBook);
router.put("/books/:id", updateBook);
router.delete("/books/:id", deleteBook);

// 3. Coupons Management
router.get("/coupons", getCoupons);
router.post("/coupons", createCoupon);
router.patch("/coupons/:id/toggle", toggleCouponStatus);
router.patch("/coupons/:id", toggleCouponStatus);
router.delete("/coupons/:id", deleteCoupon);

// 4. Marketing Campaigns
router.get("/campaigns", getCampaigns);
router.post("/campaigns", createCampaign);
router.patch("/campaigns/:id/status", updateCampaignStatus);
router.delete("/campaigns/:id", deleteCampaign);

// 5. Earnings & Payouts
router.get("/earnings", getEarnings);
router.post("/payouts", requestPayout);
router.get("/payouts", getPayouts);

// 6. Analytics & Dashboard Stats
router.get("/dashboard-stats", getDashboardStats);
router.get("/analytics", getAnalytics);

export default router;