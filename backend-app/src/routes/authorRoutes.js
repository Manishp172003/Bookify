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

router.post("/coupons/validate", validateCoupon);

router.get(
  "/campaigns/active-featured",
  getActiveFeaturedCampaigns
);

router.post(
  "/campaigns/:id/track",
  trackCampaignEngagement
);

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

router.use(
  protect,
  authorize("author", "admin")
);

router.get("/profile", getAuthorProfile);

router.get("/my-books", getMyBooks);

router.post(
  "/books",
  uploadSingle("image", "bookify/books"),
  submitBook
);

router.put("/books/:id", updateBook);

router.delete("/books/:id", deleteBook);

router.get("/coupons", getCoupons);

router.post("/coupons", createCoupon);

router.patch(
  "/coupons/:id/toggle",
  toggleCouponStatus
);

router.patch(
  "/coupons/:id",
  toggleCouponStatus
);

router.delete(
  "/coupons/:id",
  deleteCoupon
);

router.get("/campaigns", getCampaigns);

router.post("/campaigns", createCampaign);

router.patch(
  "/campaigns/:id/status",
  updateCampaignStatus
);

router.delete(
  "/campaigns/:id",
  deleteCampaign
);

router.get("/earnings", getEarnings);

router.post("/payouts", requestPayout);

router.get("/payouts", getPayouts);

router.get(
  "/dashboard-stats",
  getDashboardStats
);

router.get(
  "/analytics",
  getAnalytics
);

export default router;