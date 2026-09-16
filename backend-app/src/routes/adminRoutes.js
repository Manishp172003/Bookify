import express from "express";

import {
  getMetrics,
  getListings,
  moderateListing,
  getOrdersEscrow,
  updateEscrow,
  getUsers,
  verifyAuthor,
  getDisputes,
} from "../controllers/adminController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/metrics", getMetrics);

router.get("/listings", getListings);

router.patch("/listings/:id", moderateListing);

router.get("/orders-escrow", getOrdersEscrow);

router.patch("/orders/:id/escrow", updateEscrow);

router.get("/users", getUsers);

router.patch("/authors-verification/:id", verifyAuthor);

router.get("/disputes", getDisputes);

export default router;