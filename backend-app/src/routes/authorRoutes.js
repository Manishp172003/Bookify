import express from "express";

import {
  getMyBooks,
  submitBook,
  getAnalytics,
  getEarnings,
  createCoupon,
  getCoupons,
  validateCoupon,
} from "../controllers/authorController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("author", "admin"));

router.get("/my-books", getMyBooks);

router.post("/books", submitBook);

router.get("/analytics", getAnalytics);

router.get("/earnings", getEarnings);

router.post("/coupons", createCoupon);

router.get("/coupons", getCoupons);

router.post("/coupons/validate", validateCoupon);

export default router;