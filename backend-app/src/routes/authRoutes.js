import express from "express";

import {
  getMyBooks,
  submitBook,
  updateBook,
  deleteBook,
  getAnalytics,
  getEarnings,
  requestPayout,
  getPayouts,
  createCoupon,
  getCoupons,
  toggleCoupon,
  deleteCoupon,
  validateCoupon,
  updateAuthorProfile,
} from "../controllers/authorController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/coupons/validate", protect, validateCoupon);

router.use(protect, authorize("author", "admin"));

router.put("/profile", updateAuthorProfile);

router.get("/my-books", getMyBooks);
router.post("/books", submitBook);
router.put("/books/:id", updateBook);
router.delete("/books/:id", deleteBook);

router.get("/analytics", getAnalytics);

router.get("/earnings", getEarnings);
router.get("/payouts", getPayouts);
router.post("/payouts", requestPayout);

router.get("/coupons", getCoupons);
router.post("/coupons", createCoupon);
router.patch("/coupons/:id/toggle", toggleCoupon);
router.delete("/coupons/:id", deleteCoupon);

export default router;